import { Engine } from 'src/engine/engine';
import { Font } from 'src/engine/font';
import { drawFrame } from 'src/engine/frame';
import { Input, Keys } from 'src/engine/input';
import { playSound, Sound } from 'src/engine/sounds';
import { Textures } from 'src/engine/textures';
import { IngredientAction } from 'src/game/ingredients';
import { Station } from 'src/game/stations/station';

interface Note {
  dir: number,
  pos: number,
  hit: boolean,
  counted: boolean,
}

// TODO: Add particle effect when hitting the right note

export class EnchantmentStation extends Station {
  readonly noteSize = 32;
  readonly hitLineX = 30 + ((this.noteSize / 2) | 0);

  noteSpeed: number = 3;
  notes: Note[] = [];

  ticksToNextNote: number = 0;

  progress: number = 0;

  update(): void {
    this.ticksToNextNote -= 1;

    // Move notes
    for (let idx = 0; idx < this.notes.length; idx += 1) {
      this.notes[idx].pos -= this.noteSpeed;
    }

    // Check if note is hit
    ['up', 'right', 'down', 'left'].forEach((kp, ki) => {
      if (Input.getKeyDown(kp as Keys)) {
        let noteWasHit: boolean = false;

        for (let idx = 0; idx < this.notes.length; idx += 1) {
          const note = this.notes[idx];

          if (note.dir !== ki) continue;

          if (this.hitLineX >= note.pos && this.hitLineX <= (note.pos + this.noteSize)) {
            this.notes[idx].hit = true;
            this.notes[idx].counted = true;
            noteWasHit = true;
            this.progress += 0.1;
            playSound(Sound.SPELL);
          }
        }

        // When the key was pressed but the note was not hit
        if (!noteWasHit) {
          this.progress -= 0.1;
          playSound(Sound.SPELL_BAD);
        }
      }
    });

    // Check for missed notes
    for (let idx = 0; idx < this.notes.length; idx += 1) {
      const note = this.notes[idx];

      if ((note.pos + this.noteSize + 5) < (this.hitLineX - 10) && !note.hit && !note.counted) {
        this.progress -= 0.1;
        note.counted = true;
      }
    }

    // Normalize progress value
    this.progress = Math.clamp(this.progress, 0, 1);

    // Add new notes
    if (this.ticksToNextNote <= 0) {
      this.notes.push({ dir: Math.randomRange(0, 3), pos: (Engine.width + this.noteSize), hit: false, counted: false });
      this.ticksToNextNote = Math.randomRange(30, 80);
    }

    // Removed old notes
    this.notes = this.notes.filter((note) => (note.pos > -this.noteSize || !note.counted));

    // Check for winning condition
    if (this.progress >= 1) this.onStationCompleteCallback(true, IngredientAction.ENCHANTING);
    if (Input.getKeyDown('b')) this.onStationCompleteCallback(false, IngredientAction.ENCHANTING);
  }

  render(ctx: CanvasRenderingContext2D): void {
    const noteBarX = this.hitLineX - ((this.noteSize / 2) | 0);
    const noteBarY = 15;

    // Clear background
    const clearHeight = noteBarY + (4 * (this.noteSize + 5));

    ctx.fillStyle = Engine.secondaryColor;
    ctx.fillRect(0, 0, Engine.width, clearHeight);

    ctx.fillStyle = Engine.primaryColor;
    ctx.fillRect(0, clearHeight, Engine.width, 1);

    // Progress bar
    const progressBarY = 5;
    const progressBarHeight = 5;

    ctx.drawRect(5, progressBarY, 100, progressBarHeight);
    ctx.fillRect(5, progressBarY, (100 * this.progress) | 0, progressBarHeight);

    // Hit line
    const hitLineY = (progressBarY + progressBarHeight + 1);
    ctx.fillRect(this.hitLineX, hitLineY, 1, (clearHeight - hitLineY - 1));

    // Notes
    this.notes.forEach((note) => {
      if (note.hit) return;

      const nx = (note.pos | 0);
      const ny = noteBarY + (note.dir * (this.noteSize + 5));

      if (note.dir === 0) {
        ctx.drawImage(Textures.enchantingKeyUpTexture.inverted, nx, ny);
      } else if (note.dir === 1) {
        ctx.drawImage(Textures.enchantingKeyRightTexture.inverted, nx, ny);
      } else if (note.dir === 2) {
        ctx.drawImage(Textures.enchantingKeyDownTexture.inverted, nx, ny);
      } else if (note.dir === 3) {
        ctx.drawImage(Textures.enchantingKeyLeftTexture.inverted, nx, ny);
      }
    });

    // Note bar
    ctx.drawImage(Textures.enchantingKeyUpTexture.normal, noteBarX, noteBarY + (0 * (this.noteSize + 5)));
    ctx.drawImage(Textures.enchantingKeyRightTexture.normal, noteBarX, noteBarY + (1 * (this.noteSize + 5)));
    ctx.drawImage(Textures.enchantingKeyDownTexture.normal, noteBarX, noteBarY + (2 * (this.noteSize + 5)));
    ctx.drawImage(Textures.enchantingKeyLeftTexture.normal, noteBarX, noteBarY + (3 * (this.noteSize + 5)));

    // Help
    const helpWidth = 270;
    const helpX = 9 + 2;
    const helpY = 180;
    drawFrame(helpX, helpY, helpWidth, 26, ctx, () => {
      Font.draw("Press the proper key when it's passing", helpX, helpY, ctx, true);
      Font.draw('the line to enchant the ingredient', helpX, helpY + 12, ctx, true);
    });
  }
}
