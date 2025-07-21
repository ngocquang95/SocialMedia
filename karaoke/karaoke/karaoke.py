import time
from rich.console import Console
from rich.layout import Layout
from rich.panel import Panel
from rich.text import Text
from rich.live import Live
from rich.table import Table
from rich.progress import Progress, SpinnerColumn, TextColumn, BarColumn
from rich.align import Align

console = Console()

# lyrics sẽ được gán động từ main.py
lyrics = {}

def format_time(ms):
    seconds = int(ms // 1000)
    minutes = int(seconds // 60)
    seconds = int(seconds % 60)
    return f"{minutes:02d}:{seconds:02d}"

def get_current_sentence(current_time):
    for sentence_key, words in lyrics.items():
        start_time = words[0]['time']
        end_time = words[-1]['time'] + 1000
        if start_time <= current_time <= end_time:
            return sentence_key, words
    return None, None

def get_next_sentence(current_time):
    for sentence_key, words in lyrics.items():
        if words[0]['time'] > current_time:
            return sentence_key, words
    return None, None

def create_lyrics_text(sentence_words, current_time, is_current=True):
    if not sentence_words:
        return Text("")
    text = Text()
    for word in sentence_words:
        if is_current and word['time'] <= current_time <= word['time'] + 800:
            text.append(word['text'] + " ", style="bold yellow on dark_blue")
        elif word['time'] <= current_time:
            text.append(word['text'] + " ", style="dim white")
        else:
            text.append(word['text'] + " ", style="white")
    return text

def create_progress_bar(current_time, total_duration):
    progress = Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        BarColumn(complete_style="green", finished_style="bright_green"),
        TextColumn("[progress.percentage]{task.percentage:>3.0f}%"),
        TextColumn(f"[yellow]{format_time(current_time)}[/yellow]"),
        console=console
    )
    task = progress.add_task("🎵 Đang phát...", total=total_duration)
    progress.update(task, completed=current_time)
    return progress

def create_karaoke_layout(current_time):
    layout = Layout()
    last_sentence = list(lyrics.values())[-1]
    total_duration = last_sentence[-1]['time']
    layout.split_column(
        Layout(name="header", size=4),
        Layout(name="progress", size=3),
        Layout(name="main", size=10),
        Layout(name="footer", size=3)
    )
    # Header
    title_text = Text("🎵 KARAOKE PLAYER", style="bold cyan", justify="center")
    subtitle_text = Text("", style="italic cyan", justify="center")
    time_text = Text(f"⏰ {format_time(current_time)} / {format_time(total_duration)}", style="yellow", justify="center")
    header_content = Layout()
    header_content.split_column(
        Layout(title_text),
        Layout(subtitle_text),
        Layout(time_text)
    )
    header_panel = Panel(header_content, style="cyan", border_style="bright_cyan")
    layout["header"].update(header_panel)
    # Progress bar
    progress = create_progress_bar(current_time, total_duration)
    progress_panel = Panel(progress, style="green", border_style="bright_green")
    layout["progress"].update(progress_panel)
    # Main content
    current_sentence_key, current_sentence_words = get_current_sentence(current_time)
    next_sentence_key, next_sentence_words = get_next_sentence(current_time)
    main_content = Layout()
    main_content.split_column(
        Layout(name="current", size=5),
        Layout(name="next", size=5)
    )
    if current_sentence_words:
        current_text = create_lyrics_text(current_sentence_words, current_time, True)
        current_content = Layout()
        current_content.split_column(
            Layout(Text("🎤 ĐANG HÁT", style="bold green", justify="center")),
            Layout(Align(current_text, align="center"))
        )
        current_panel = Panel(current_content, title="🎤 Câu hiện tại", style="green", border_style="bright_green")
        main_content["current"].update(current_panel)
    else:
        main_content["current"].update(Panel("", title="🎤 Câu hiện tại", style="green", border_style="bright_green"))
    if next_sentence_words:
        next_text = create_lyrics_text(next_sentence_words, current_time, False)
        next_content = Layout()
        next_content.split_column(
            Layout(Text("⏭️ TIẾP THEO", style="bold blue", justify="center")),
            Layout(Align(next_text, align="center"))
        )
        next_panel = Panel(next_content, title="⏭️ Câu tiếp theo", style="blue", border_style="bright_blue")
        main_content["next"].update(next_panel)
    else:
        main_content["next"].update(Panel("", title="⏭️ Câu tiếp theo", style="blue", border_style="bright_blue"))
    layout["main"].update(main_content)
    controls_text = Text("🎮 Điều khiển: Ctrl+C để dừng | 🎵 Đang phát...", style="yellow", justify="center")
    footer_panel = Panel(controls_text, style="yellow", border_style="bright_yellow")
    layout["footer"].update(footer_panel)
    return layout

def play_karaoke_rich():
    console.print("[bold green]🎵 Bắt đầu phát karaoke với Rich...[/bold green]")
    console.print("[yellow]Nhấn Ctrl+C để dừng[/yellow]")
    time.sleep(2)
    start_time = time.time() * 1000
    try:
        with Live(create_karaoke_layout(0), refresh_per_second=10, screen=True) as live:
            while True:
                current_time = (time.time() * 1000) - start_time
                live.update(create_karaoke_layout(current_time))
                last_sentence = list(lyrics.values())[-1]
                if current_time > last_sentence[-1]['time'] + 3000:
                    console.print("[bold green]🎉 Bài hát đã kết thúc![/bold green]")
                    break
                time.sleep(0.1)
    except KeyboardInterrupt:
        console.print("[bold red]⏹️ Đã dừng karaoke[/bold red]")

def main():
    console.clear()
    total_sentences = len(lyrics)
    last_sentence = list(lyrics.values())[-1]
    total_duration = last_sentence[-1]['time']
    info_table = Table(title="📊 Thông tin bài hát", show_header=True, header_style="bold magenta")
    info_table.add_column("Mục", style="cyan", justify="center")
    info_table.add_column("Chi tiết", style="green", justify="center")
    info_table.add_row("📝 Số câu", str(total_sentences))
    info_table.add_row("⏱️ Thời lượng", format_time(total_duration))
    console.print(info_table)
    console.print()
    input("Nhấn Enter để bắt đầu karaoke...")
    play_karaoke_rich()

if __name__ == "__main__":
    main() 