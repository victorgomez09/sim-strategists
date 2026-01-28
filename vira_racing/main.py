import customtkinter as ctk
from adapter.data_model import SimData
from adapter.adapters import RF2Adapter, LMUAdapter

class App(ctk.CTk):
    def __init__(self, shared_data):
        super().__init__()
        self.data = shared_data
        self.adapter = None
        
        self.title("LMU Strategy Tool")
        self.geometry("450x500")
        ctk.set_appearance_mode("dark")

        # UI Elements
        ctk.CTkLabel(self, text="ESTRATEGIA DE CARRERA", font=("Arial", 20, "bold")).pack(pady=10)
        
        self.selector = ctk.CTkOptionMenu(self, values=["OFF", "rFactor 2", "LMU"], command=self.switch_source)
        self.selector.pack(pady=10)

        self.fuel_lbl = self.create_metric("FUEL ACTUAL", "#00FF00")
        self.inst_cons_lbl = self.create_metric("CONSUMO INST. (L/h)", "#9b59b6")
        self.est_laps_lbl = self.create_metric("VUELTAS RESTANTES", "#e67e22")
        self.add_lbl = self.create_metric("AÑADIR EN PIT", "#FF5555")
        self.cons_lbl = self.create_metric("CONSUMO MEDIO", "#3498db")
        
        self.status = ctk.CTkLabel(self, text="Desconectado", text_color="gray")
        self.status.pack(side="bottom", pady=10)

        self.update_ui()

    def create_metric(self, title, color):
        frame = ctk.CTkFrame(self)
        frame.pack(fill="x", padx=20, pady=5)
        ctk.CTkLabel(frame, text=title, text_color=color, font=("Arial", 12, "bold")).pack()
        lbl = ctk.CTkLabel(frame, text="--", font=("Arial", 32, "bold"))
        lbl.pack()
        return lbl

    def switch_source(self, mode):
        if self.adapter: self.adapter.stop()
        if mode == "rFactor 2": self.adapter = RF2Adapter(self.data)
        elif mode == "LMU": self.adapter = LMUAdapter(self.data)
        if self.adapter: self.adapter.start()

    def update_ui(self):
        if self.data.is_connected:
            self.fuel_lbl.configure(text=f"{self.data.fuel:.2f} L")
            self.inst_cons_lbl.configure(text=f"{self.data.instant_cons:.1f}")
            self.est_laps_lbl.configure(text=f"{self.data.laps_estimated:.1f} v")
            self.add_lbl.configure(text=f"{self.data.fuel_to_add:.1f} L")
            self.cons_lbl.configure(text=f"{self.data.avg_cons:.2f} L/v")
            self.status.configure(text="ONLINE", text_color="#00FF00")
        else:
            self.status.configure(text="OFFLINE", text_color="gray")
        self.after(100, self.update_ui)

if __name__ == "__main__":
    shared_data = SimData()
    app = App(shared_data)
    app.mainloop()