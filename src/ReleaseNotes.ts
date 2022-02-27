import { App, MarkdownRenderer, Modal } from "obsidian";
import ExcalidrawPlugin from "./Main";
import { FIRST_RUN, RELEASE_NOTES } from "./Messages"

export class ReleaseNotes extends Modal {
  private plugin: ExcalidrawPlugin;
  private version: string;

  constructor(app: App, plugin: ExcalidrawPlugin, version: string) {
    super(app);
    this.plugin = plugin;
    //@ts-ignore
    this.version = version;
  }

  onOpen(): void {
    this.contentEl.classList.add("excalidraw-release");
    this.containerEl.classList.add(".excalidraw-release");
    this.titleEl.setText(`Welcome to Excalidraw ${this.version}`);
    this.createForm();
  }

  async onClose() {
    this.contentEl.empty();
    await this.plugin.loadSettings();
    this.plugin.settings.previousRelease = this.version;
    await this.plugin.saveSettings();
  }

  async createForm() {
    const prevRelease = this.plugin.settings.previousRelease;
    const message = this.version 
      ? Object
          .keys(RELEASE_NOTES)
          .filter(key=>key>prevRelease)
          .map((key:string)=>`# ${key}\n${RELEASE_NOTES[key]}`)
          .slice(0,10)
          .join("\n\n")
      : FIRST_RUN;
    await MarkdownRenderer.renderMarkdown(
      message,
      this.contentEl,
      "",
      this.plugin,
    );

    this.contentEl.createEl("p", { text: "" }, (el) => {
      //files manually follow one of two options:
      el.style.textAlign = "right";
      const bOk = el.createEl("button", { text: "Close" });
      bOk.onclick = () => this.close();
    });
  }
}