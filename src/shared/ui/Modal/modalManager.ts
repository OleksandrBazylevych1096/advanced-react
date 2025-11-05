class ModalManager {
  private static instance: ModalManager;
  private openModalsCount = 0;
  private originalOverflow = "";
  private originalPaddingRight = "";

  private constructor() {}

  static getInstance(): ModalManager {
    if (!ModalManager.instance) {
      ModalManager.instance = new ModalManager();
    }
    return ModalManager.instance;
  }

  openModal() {
    if (this.openModalsCount === 0) {
      this.originalOverflow = document.body.style.overflow;
      this.originalPaddingRight = document.body.style.paddingRight;

      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = "hidden";

      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }
    }
    this.openModalsCount++;
  }

  closeModal() {
    this.openModalsCount--;

    if (this.openModalsCount === 0) {
      document.body.style.overflow = this.originalOverflow;
      document.body.style.paddingRight = this.originalPaddingRight;
    }

    if (this.openModalsCount < 0) {
      this.openModalsCount = 0;
    }
  }

  reset() {
    this.openModalsCount = 0;
    document.body.style.overflow = this.originalOverflow;
    document.body.style.paddingRight = this.originalPaddingRight;
  }

  getOpenModalsCount() {
    return this.getOpenModalsCount;
  }
}

export const modalManager = ModalManager.getInstance();
