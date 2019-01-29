import subprocess
import argparse

parser = argparse.ArgumentParser(description='Dockerize Serviceunit')

subprocess.call([f"docker-compose down --rmi all"], executable = "/bin/bash", shell = True)
subprocess.call([f"docker-compose build"], executable = "/bin/bash", shell = True)
# This assumes you have already logged in to docker from the shell where you're working...
subprocess.call([f"docker-compose push"], executable = "/bin/bash", shell = True)
