import { Engine } from 'src/engine/engine';

interface KeyState {
  up: boolean,
  down: boolean,
  left: boolean,
  right: boolean,

  a: boolean,
  b: boolean,
}

export type Keys = keyof KeyState;

export abstract class Input {
  static pointerX: number = 0;
  static pointerY: number = 0;

  private static keyState: KeyState = {
    up: false, down: false, right: false, left: false, a: false, b: false,
  };

  private static previousKeyState: KeyState = {
    up: false, down: false, right: false, left: false, a: false, b: false,
  };

  static getKey(key: Keys): boolean {
    return this.keyState[key];
  }

  static getKeyDown(key: Keys): boolean {
    return this.keyState[key] && !this.previousKeyState[key];
  }

  static update(): void {
    Input.previousKeyState = { ...Input.keyState };
  }

  static initialize(canvas: HTMLCanvasElement): void {
    document.addEventListener('keydown', (e) => {
      let keyHit = false;

      if (e.key === 'w' || e.key === 'ArrowUp') {
        Input.keyState.up = true;
        keyHit = true;
      }
      if (e.key === 's' || e.key === 'ArrowDown') {
        Input.keyState.down = true;
        keyHit = true;
      }
      if (e.key === 'a' || e.key === 'ArrowLeft') {
        Input.keyState.left = true;
        keyHit = true;
      }
      if (e.key === 'd' || e.key === 'ArrowRight') {
        Input.keyState.right = true;
        keyHit = true;
      }
      if (e.key === 'Enter') {
        Input.keyState.a = true;
        keyHit = true;
      }
      if (e.key === 'Escape') {
        Input.keyState.b = true;
        keyHit = true;
      }

      if (keyHit) e.preventDefault();
    }, false);

    document.addEventListener('keyup', (e) => {
      let keyHit = false;

      if (e.key === 'w' || e.key === 'ArrowUp') {
        Input.keyState.up = false;
        keyHit = true;
      }
      if (e.key === 's' || e.key === 'ArrowDown') {
        Input.keyState.down = false;
        keyHit = true;
      }
      if (e.key === 'a' || e.key === 'ArrowLeft') {
        Input.keyState.left = false;
        keyHit = true;
      }
      if (e.key === 'd' || e.key === 'ArrowRight') {
        Input.keyState.right = false;
        keyHit = true;
      }
      if (e.key === 'Enter') {
        Input.keyState.a = false;
        keyHit = true;
      }
      if (e.key === 'Escape') {
        Input.keyState.b = false;
        keyHit = true;
      }

      if (keyHit) e.preventDefault();
    }, false);

    canvas.addEventListener('mousemove', (e) => {
      const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
      const x = (e.clientX - rect.left) | 0;
      const y = (e.clientY - rect.top) | 0;
      Input.pointerX = ((x / canvas.clientWidth) * Engine.width) | 0;
      Input.pointerY = ((y / canvas.clientHeight) * Engine.height) | 0;
    });
  }
}
