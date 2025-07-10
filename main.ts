import { Plugin, MarkdownView } from 'obsidian';

export default class SpoilerBlock extends Plugin {
  async onload() {
    console.log('Plugin loaded: SpoilerBlock');

    // 1) Register the spoiler-block code processor
    this.registerMarkdownCodeBlockProcessor(
      'spoiler-block',
      (source, el, _) => {
        const container = el.createEl('div');
        container.className = 'spoiler';

        const rows = source.split('\n');
        for (let row of rows) {
          container.createEl('div', { text: row });
        }

        container.addEventListener('click', () => {
          if (container.className === 'spoiler') {
            container.className = 'spoiler-show';
          }
        });
        container.addEventListener('dblclick', () => {
          if (container.className === 'spoiler-show') {
            container.className = 'spoiler';
          }
        });
      }
    );

    // 2) Add a command so users can bind a hotkey in Settings → Hotkeys
    this.addCommand({
      id: 'insert-spoiler-block',
      name: 'Insert Spoiler Block',
      hotkeys: [
        {
          modifiers: ['Mod', 'Shift'],  // Mod = Ctrl on Win/Linux, Cmd on macOS
          key: 'S',
        },
      ],
      callback: () => {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (!view) return;
        const editor = view.editor;

        // Insert the spoiler-block snippet
        editor.replaceSelection('```spoiler-block\n\n```\n');

        // Move cursor inside the empty line
        const { line } = editor.getCursor();
        editor.setCursor({ line: line - 2, ch: 0 });
      },
    });
  }

  onunload() {
    console.log('Plugin unloaded: SpoilerBlock');
  }
}
