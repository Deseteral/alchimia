// @ts-ignore
import menuPickUrl from 'url:../../assets/sounds/menu_pick.wav';
// @ts-ignore
import menuConfirmUrl from 'url:../../assets/sounds/menu_confirm.wav';
// @ts-ignore
import bookUrl from 'url:../../assets/sounds/book.wav';
// @ts-ignore
import newClientUrl from 'url:../../assets/sounds/new_client.wav';
// @ts-ignore
import tableMoveUrl from 'url:../../assets/sounds/table_move.wav';
// @ts-ignore
import bubblesUrl from 'url:../../assets/sounds/bubbles.wav';
// @ts-ignore
import goodPotionUrl from 'url:../../assets/sounds/good_potion.wav';
// @ts-ignore
import badPotionUrl from 'url:../../assets/sounds/bad_potion.wav';
// @ts-ignore
import knifeUrl from 'url:../../assets/sounds/knife.wav';
// @ts-ignore
import spellUrl from 'url:../../assets/sounds/spell.wav';
// @ts-ignore
import spellBadUrl from 'url:../../assets/sounds/spell_bad.wav';

export enum Sound {
  MENU_PICK = menuPickUrl,
  MENU_CONFIRM = menuConfirmUrl,
  BOOK = bookUrl,
  NEW_CLIENT = newClientUrl,
  TABLE_MOVE = tableMoveUrl,
  BUBBLES = bubblesUrl,
  GOOD_POTION = goodPotionUrl,
  BAD_POTION = badPotionUrl,
  KNIFE = knifeUrl,
  SPELL = spellUrl,
  SPELL_BAD = spellBadUrl,
}

export function preloadSounds(): void {
  [
    Sound.MENU_PICK,
    Sound.MENU_CONFIRM,
    Sound.BOOK,
    Sound.NEW_CLIENT,
    Sound.TABLE_MOVE,
    Sound.BUBBLES,
    Sound.GOOD_POTION,
    Sound.BAD_POTION,
    Sound.KNIFE,
    Sound.SPELL,
    Sound.SPELL_BAD,
  ].forEach((s) => {
    // Force the browser to download sound files
    const audio = new Audio(s.toString());
    audio.load();
  });
}

export function playSound(sound: Sound, loop: boolean = false): (() => void) {
  const audio = new Audio(sound.toString());
  audio.loop = loop;
  audio.play();
  return () => audio.pause();
}
