import os
import importlib.util
from rich.console import Console
from rich.table import Table
from rich import box
from rich.style import Style
from rich.align import Align
from rich.panel import Panel
from rich.text import Text
import sys
import platform

SONGS_DIR = os.path.join(os.path.dirname(__file__), 'songs')
console = Console()

def get_song_infos():
    song_infos = []
    files = [f for f in os.listdir(SONGS_DIR) if f.endswith('.py') and not f.startswith('__')]
    for f in sorted(files):
        path = os.path.join(SONGS_DIR, f)
        spec = importlib.util.spec_from_file_location('song_module', path)
        song_module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(song_module)
        title = getattr(song_module, 'title', f[:-3])
        lyrics = getattr(song_module, 'lyrics', None)
        song_infos.append({'file': f, 'title': title, 'lyrics': lyrics})
    return song_infos

if platform.system() == 'Windows':
    import msvcrt
    def getch():
        ch1 = msvcrt.getch()
        if ch1 in [b'\xe0', b'\x00']:
            ch2 = msvcrt.getch()
            if ch2 == b'H':
                return 'UP'
            elif ch2 == b'P':
                return 'DOWN'
            else:
                return ''
        elif ch1 == b'\r':
            return 'ENTER'
        else:
            try:
                return ch1.decode()
            except:
                return ''
else:
    import termios
    import tty
    def getch():
        fd = sys.stdin.fileno()
        old_settings = termios.tcgetattr(fd)
        try:
            tty.setraw(fd)
            ch = sys.stdin.read(1)
            if ch == '\x1b':
                ch += sys.stdin.read(2)
                if ch == '\x1b[A':
                    return 'UP'
                elif ch == '\x1b[B':
                    return 'DOWN'
                else:
                    return ''
            elif ch in ('\r', '\n'):
                return 'ENTER'
            else:
                return ch
        finally:
            termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)

def menu(song_infos):
    current_row = 0
    while True:
        console.clear()
        # Hiển thị tên bài hát được chọn ở giữa, font lớn, padding nhỏ lại
        selected_title = song_infos[current_row]['title']
        panel = Panel(Text(selected_title, style="bold magenta", justify="center", no_wrap=True),
                      padding=(1, 4), style="on cyan", border_style="bright_white")
        console.print(Align.center(panel))
        # Hướng dẫn ở dòng dưới
        console.print(Align.center(Text("↑↓, Enter để chọn", style="italic cyan", justify="center")), justify="center")
        # Bảng nhỏ bên dưới
        table = Table(box=box.SIMPLE_HEAVY, show_header=True, header_style="bold yellow", width=38)
        table.add_column("STT", justify="center", style="bold yellow", width=6)
        table.add_column("Tên bài hát", style="bold magenta")
        for idx, song in enumerate(song_infos):
            style = Style(bgcolor="cyan", color="black") if idx == current_row else None
            table.add_row(str(idx+1), song['title'], style=style)
        console.print(Align.center(table))
        ch = getch()
        if ch == 'UP' and current_row > 0:
            current_row -= 1
        elif ch == 'DOWN' and current_row < len(song_infos) - 1:
            current_row += 1
        elif ch == 'ENTER':
            return song_infos[current_row]
        elif ch in ('k', 'K') and current_row > 0:
            current_row -= 1
        elif ch in ('j', 'J') and current_row < len(song_infos) - 1:
            current_row += 1

def main():
    song_infos = get_song_infos()
    if not song_infos:
        console.print('[bold red]Không tìm thấy bài hát nào trong thư mục Songs![/bold red]')
        return
    selected = menu(song_infos)
    lyrics = selected['lyrics']
    if lyrics:
        import importlib
        karaoke = importlib.import_module('karaoke.karaoke')
        karaoke.lyrics = lyrics
        karaoke.song_title = selected['title']  # Truyền title sang karaoke.py
        karaoke.main()
    else:
        console.print('[bold red]Không tìm thấy lyrics trong file![/bold red]')

if __name__ == '__main__':
    main() 