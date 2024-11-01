// electron.d.ts
declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        send: (channel: string, data: any) => void;
        on: (channel: string, func: (...args: any[]) => void) => void;
      };
      printQueue: (data: string) => void;
      onPrintResponse: (callback: (response: string) => void) => void;
    };
  }
}

export {};
