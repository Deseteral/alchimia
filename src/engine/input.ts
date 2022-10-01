interface KeyState {
  up: boolean,
  down: boolean,
  left: boolean,
  right: boolean,

  a: boolean,
  b: boolean,
}

type Keys = keyof KeyState;

export abstract class Input {
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

  static initialize(): void {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'w') Input.keyState.up = true;
      if (e.key === 's') Input.keyState.down = true;
      if (e.key === 'a') Input.keyState.left = true;
      if (e.key === 'd') Input.keyState.right = true;

      if (e.key === 'Enter') Input.keyState.a = true;
      if (e.key === 'Escape') Input.keyState.b = true;
    }, false);

    document.addEventListener('keyup', (e) => {
      if (e.key === 'w') Input.keyState.up = false;
      if (e.key === 's') Input.keyState.down = false;
      if (e.key === 'a') Input.keyState.left = false;
      if (e.key === 'd') Input.keyState.right = false;

      if (e.key === 'Enter') Input.keyState.a = false;
      if (e.key === 'Escape') Input.keyState.b = false;
    }, false);
  }
}
