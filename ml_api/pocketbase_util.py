import os

from pocketbase import PocketBase

ip = '127.0.0.0'
port = os.getenv('PB_PORT', 8090)

pb = PocketBase('http://127.0.0.1:8090')#f'{ip}:{port}')
