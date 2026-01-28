import sys
from PySide6.QtWidgets import QApplication, QMainWindow, QVBoxLayout, QWidget, QLabel, QComboBox, QGridLayout
from PySide6.QtCore import QTimer, Qt
from adapter.adapters import RF2SharedMemoryAdapter, LMUWebAPIAdapter

class TelemetryApp(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("LMU Strategy Engineer")
        self.setMinimumSize(500, 400)
        self.setStyleSheet("background-color: #121212;")
        self.adapter = None

        layout = QVBoxLayout()
        
        # Selector
        self.selector = QComboBox()
        self.selector.addItems(["--- Selecciona Juego ---", "rFactor 2", "Le Mans Ultimate"])
        self.selector.currentIndexChanged.connect(self.handle_source_change)
        layout.addWidget(self.selector)

        # Dashboard Grid
        grid = QGridLayout()
        
        self.fuel_main = self.create_card("COMBUSTIBLE", "-- L", "#00FF00")
        self.fuel_to_add = self.create_card("AÑADIR PARA FIN", "-- L", "#FF5555")
        self.cons_avg = self.create_card("MEDIA", "-- L/v", "#3498db")
        self.cons_last = self.create_card("V. ANTERIOR", "-- L/v", "#f1c40f")
        self.cons_cur = self.create_card("V. ACTUAL", "-- L/v", "#aaaaaa")
        self.laps_rem = self.create_card("VUELTAS REST.", "--", "#e67e22")

        grid.addWidget(self.fuel_main, 0, 0, 1, 2) # Ocupa 2 columnas
        grid.addWidget(self.fuel_to_add, 1, 0, 1, 2)
        grid.addWidget(self.cons_avg, 2, 0)
        grid.addWidget(self.cons_last, 2, 1)
        grid.addWidget(self.cons_cur, 3, 0)
        grid.addWidget(self.laps_rem, 3, 1)

        layout.addLayout(grid)
        self.status = QLabel("Desconectado")
        self.status.setStyleSheet("color: #444;")
        layout.addWidget(self.status)

        container = QWidget()
        container.setLayout(layout)
        self.setCentralWidget(container)

        self.ui_timer = QTimer()
        self.ui_timer.timeout.connect(self.update_ui)
        self.ui_timer.start(100)

    def create_card(self, title, value, color):
        frame = QWidget()
        l = QVBoxLayout(frame)
        t_lbl = QLabel(title)
        t_lbl.setStyleSheet(f"color: {color}; font-size: 10px; font-weight: bold;")
        v_lbl = QLabel(value)
        v_lbl.setStyleSheet(f"color: white; font-size: 24px; font-weight: bold;")
        l.addWidget(t_lbl)
        l.addWidget(v_lbl)
        frame.setStyleSheet("background-color: #1e1e1e; border-radius: 5px; padding: 5px;")
        # Guardamos referencia al label del valor para actualizarlo
        frame.value_label = v_lbl
        return frame

    def handle_source_change(self, index):
        if self.adapter: self.adapter.stop()
        if index == 1: self.adapter = RF2SharedMemoryAdapter()
        elif index == 2: self.adapter = LMUWebAPIAdapter()
        if self.adapter: self.adapter.start()

    def update_ui(self):
        if self.adapter and self.adapter.connected:
            self.fuel_main.value_label.setText(f"{self.adapter.fuel:.2f} L")
            self.fuel_to_add.value_label.setText(f"{self.adapter.fuel_to_add:.1f} L")
            self.cons_avg.value_label.setText(f"{self.adapter.avg_cons:.2f}")
            self.cons_last.value_label.setText(f"{self.adapter.last_lap_cons:.2f}")
            self.cons_cur.value_label.setText(f"{self.adapter.current_lap_cons:.2f}")
            
            v_restantes = self.adapter.fuel / self.adapter.avg_cons if self.adapter.avg_cons > 0 else 0
            self.laps_rem.value_label.setText(f"{v_restantes:.1f}")
            self.status.setText("ONLINE")
        else:
            self.status.setText("OFFLINE")

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = TelemetryApp()
    window.show()
    sys.exit(app.exec())