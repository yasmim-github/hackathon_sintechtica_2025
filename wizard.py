import tkinter as tk
from tkinter import messagebox
import os
import platform
import subprocess
import sys


def install_dialogue():
    # Create the main window
    root = tk.Tk()
    root.withdraw()

    requirements_file = 'requirements.txt'

    if not os.path.exists(requirements_file):
        print(f"Erro : O arquivo requirements.txt não existe")
        sys.exit(1)
    print("Verificando se as dependências do projeto estão instaladas...")
    user_input = input(f"Para instalar as dependências listadas em '{requirements_file}', digite 'y' (sim) ou 'n' (não): ").lower()

    response = messagebox.askyesno(
        title="Install Libraries",
        message="Necessary Python libraries are not installed. Do you want to install them now?"
    )

    if response:
        messagebox.showinfo(
            title="Installing libraries",
            message="Don´t close the aplication while the installation is running"
        )

        try:
            subprocess.check_call([sys.executable, "-m","pip","install","-r",requirements_file])
            print("Instalação concluída com sucesso!")
        except subprocess.CalledProcessError as e:
            print(f"Erro durante a instalação: {e}")
            sys.exit(1)
        except Exception as e:
            print(f"Um erro inesperado ocorrou {e}")
            sys.exit(1)
        
    else:
        messagebox.showinfo(
            title="Installation Cancelled",
            message="Without the libraries, this wizard the system can´t function properly"
        )
        sys.exit(0)
        print("User declined installation.")
        # Add your exit logic here
        # For example: root.quit() or sys.exit()

if __name__ == "__main__":
    install_dialogue()

#
#   verifying Operating system
#

opsys = str(platform.system())
opver = str(platform.version())

print(opsys)

#if opsys == "Windows":
    
