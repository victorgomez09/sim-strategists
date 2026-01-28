import customtkinter as ctk
from adapter.data_model import SimData
from adapter.rfactor2_adapter import RF2Adapter

class TelemetryApp(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.title("LMU/rF2 Strategy Engineer")
        self.geometry("900x600")
        ctk.set_appearance_mode("dark")
        
        # Inicializar datos y adaptador
        self.data = SimData()
        self.adapter = RF2Adapter(self.data)
        
        # --- DISEÑO DE LA INTERFAZ ---
        
        # 1. Barra Superior (Sesión y Circuito)
        self.header_frame = ctk.CTkFrame(self, corner_radius=0, fg_color="#1a1a1a")
        self.header_frame.pack(side="top", fill="x", padx=0, pady=0)
        
        self.track_lbl = ctk.CTkLabel(self.header_frame, text="ESPERANDO JUEGO...", font=("Orbitron", 22, "bold"))
        self.track_lbl.pack(pady=(10, 5))
        
        self.session_detail_lbl = ctk.CTkLabel(self.header_frame, text="Desconectado", text_color="#aaaaaa")
        self.session_detail_lbl.pack(pady=(0, 10))

        # 2. Panel de Info Ambiental (Clima y Temperaturas)
        self.env_frame = ctk.CTkFrame(self, fg_color="transparent")
        self.env_frame.pack(fill="x", padx=20, pady=10)
        
        self.temp_pista_lbl = self.create_env_widget(self.env_frame, "PISTA", "0.0°")
        self.temp_aire_lbl = self.create_env_widget(self.env_frame, "AIRE", "0.0°")
        self.clima_lbl = self.create_env_widget(self.env_frame, "CLIMA", "---")
        self.time_left_lbl = self.create_env_widget(self.env_frame, "TIEMPO REST.", "00:00")

        # 3. Grid Central de Métricas (Combustible y Autonomía)
        self.grid_frame = ctk.CTkFrame(self, fg_color="transparent")
        self.grid_frame.pack(expand=True, fill="both", padx=20, pady=20)
        self.grid_frame.columnconfigure((0, 1, 2), weight=1)

        self.fuel_lbl = self.create_card(self.grid_frame, "FUEL ACTUAL", "#3498db", 0, 0)
        self.inst_cons_lbl = self.create_card(self.grid_frame, "CONSUMO L/H", "#9b59b6", 0, 1)
        self.est_laps_lbl = self.create_card(self.grid_frame, "AUTONOMÍA (V)", "#e67e22", 0, 2)
        
        self.avg_cons_lbl = self.create_card(self.grid_frame, "MEDIA VUELTA", "#2ecc71", 1, 0)
        self.fuel_needed_lbl = self.create_card(self.grid_frame, "AÑADIR EN PIT", "#e74c3c", 1, 1)
        self.status_lbl = self.create_card(self.grid_frame, "ESTADO", "#95a5a6", 1, 2)

        # Iniciar adaptador y bucle de actualización
        self.adapter.start()
        self.update_ui()

    def create_env_widget(self, parent, title, value):
        frame = ctk.CTkFrame(parent, fg_color="#2b2b2b", height=40)
        frame.pack(side="left", expand=True, padx=5, fill="both")
        
        lbl_title = ctk.CTkLabel(frame, text=title, font=("Roboto", 10), text_color="#888888")
        lbl_title.pack(pady=(2, 0))
        
        lbl_val = ctk.CTkLabel(frame, text=value, font=("Roboto", 14, "bold"))
        lbl_val.pack(pady=(0, 2))
        return lbl_val

    def create_card(self, parent, title, color, row, col):
        card = ctk.CTkFrame(parent, corner_radius=15, border_width=2, border_color=color)
        card.grid(row=row, column=col, padx=10, pady=10, sticky="nsew")
        
        lbl_title = ctk.CTkLabel(card, text=title, font=("Roboto", 12, "bold"), text_color=color)
        lbl_title.pack(pady=(15, 5))
        
        lbl_val = ctk.CTkLabel(card, text="---", font=("Orbitron", 32, "bold"))
        lbl_val.pack(pady=(5, 15))
        return lbl_val

    def format_time(self, seconds):
        if seconds < 0: return "00:00"
        m, s = divmod(int(seconds), 60)
        h, m = divmod(m, 60)
        return f"{h:02d}:{m:02d}:{s:02d}" if h > 0 else f"{m:02d}:{s:02d}"

    def update_ui(self):
        if self.data.is_connected:
            # Info Sesión
            self.track_lbl.configure(text=self.data.track_name.upper())
            self.session_detail_lbl.configure(text=f"MODO: {self.data.session_type} | VUELTA: {self.data.lap}")
            
            # Info Ambiental
            self.temp_pista_lbl.configure(text=f"{self.data.track_temp:.1f}°")
            self.temp_aire_lbl.configure(text=f"{self.data.ambient_temp:.1f}°")
            clima_info = f"{self.data.weather}"
            if self.data.rain_percent > 0:
                clima_info += f"\nLLUVIA: {self.data.rain_percent:.0f}% | MOJADO: {self.data.wet_percent:.0f}%"
            self.clima_lbl.configure(text=clima_info)
            # self.clima_lbl.configure(text=f"{self.data.weather} ({self.data.lluvia:.2f}%)")
            self.time_left_lbl.configure(text=self.format_time(self.data.session_time_left))
            
            # Telemetría Principal
            self.fuel_lbl.configure(text=f"{self.data.fuel:.2f} L")
            self.inst_cons_lbl.configure(text=f"{self.data.instant_cons:.1f}")
            self.est_laps_lbl.configure(text=f"{self.data.laps_estimated:.1f}")
            
            # Estrategia
            self.avg_cons_lbl.configure(text=f"{self.data.avg_cons:.2f} L/v")
            self.fuel_needed_lbl.configure(text=f"{self.data.fuel_to_add:.1f} L")
            self.status_lbl.configure(text="ONLINE", text_color="#2ecc71")
            
            # Alerta visual si queda poco fuel (menos de 2 vueltas)
            if 0 < self.data.laps_estimated < 2.0:
                self.est_laps_lbl.configure(text_color="#e74c3c")
            else:
                self.est_laps_lbl.configure(text_color="white")
            
            if self.data.wet_percent > 30:
                self.clima_lbl.configure(text_color="#3498db") # Azul agua
            else:
                self.clima_lbl.configure(text_color="white")
        else:
            self.status_lbl.configure(text="OFFLINE", text_color="#e74c3c")
            self.session_detail_lbl.configure(text="Esperando conexión con LMU/rFactor 2...")

        # Re-programar actualización cada 100ms
        self.after(100, self.update_ui)

    def on_closing(self):
        self.adapter.stop()
        self.destroy()

if __name__ == "__main__":
    app = TelemetryApp()
    app.protocol("WM_DELETE_WINDOW", app.on_closing)
    app.mainloop()