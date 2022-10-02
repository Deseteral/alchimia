import { Message } from 'src/game/message-board';
import { Recipe } from 'src/game/recipes';

function choice(list: string[]): string {
  const idx: number = Math.randomRange(0, list.length - 1);
  return list[idx];
}

function split(text: string): string[] {
  const tokens = text.split(' ');

  const msg: string[] = [];

  let line = tokens[0];

  for (let idx = 1; idx < tokens.length; idx += 1) {
    const token = tokens[idx];

    if ((line.length + 1 + token.length) <= 37) {
      line += ` ${token}`;
    } else {
      msg.push(line);
      line = token;
    }
  }

  msg.push(line);

  return msg;
}

export function newClientMessage(recipe: Recipe): Message {
  const greetings: string[] = [
    'Hello!',
    'Hey!',
    'Good morning!',
    'Hello there!',
    'Morning!',
    'Howdy!',
    'Good to see you!',
    'Ahoy!',
    'Hello stranger!',
  ];

  const middle: string[] = [
    'How are you?',
    "It's so cold today.",
    "Beautiful day, isn't it?",
    "It looks like it's going to snow",
    "We couldn't ask for a nicer day, could we?",
    'Looking forward to the weekend?',
    "I can't believe how busy we are today!",
    "I didn't think it would be so busy today.",
  ];

  const end: string[] = [
    `Can you make me some ${recipe.name}?`,
    `I'd like ${recipe.name}, please.`,
    `Could I have a ${recipe.name}, please?`,
    `How much for ${recipe.name}?`,
    `I need some ${recipe.name}.`,
    `Do you sell ${recipe.name}?`,
    `I'll take ${recipe.name}.`,
    `I have to buy some ${recipe.name}.`,
  ];

  const msg: string = [
    choice(greetings),
    Math.random() < 0.5 ? choice(middle) : '',
    choice(end),
  ].filter((s) => s.length > 0).join(' ');

  return {
    text: split(msg),
    rightSide: false,
  };
}

export function orderCompleteMessage(recipe: Recipe): Message {
  const starters: string[] = [
    'There you go!',
    'Sir!',
    'Madame!',
  ];

  const middle: string[] = [
    `Your ${recipe.name}.`,
    `${recipe.name} for you.`,
    `One ${recipe.name} for you.`,
    `One ${recipe.name}.`,
    'Your order.',
    'This is for you.',
    'I have your order!',
    '',
  ];

  const end: string[] = [
    'Bye!',
    'Goodbye!',
    'Bye for now!',
    'See you!',
    'Be seeing you!',
    'See you soon!',
    'Cheerio!',
    'Catch you later!',
  ];

  const msg: string = [
    Math.random() < 0.5 ? choice(starters) : '',
    choice(middle),
    choice(end),
  ].filter((s) => s.length > 0).join(' ');

  return {
    text: split(msg),
    rightSide: true,
  };
}

export function clientGoodbyeMessasge(): Message {
  const list: string[] = [
    'Thank you!',
    'Bye!',
    'See you later!',
    'Perfect! Ciao!',
    'Awesome, thank you so much!',
  ];

  return {
    text: split(choice(list)),
    rightSide: true,
  };
}

export function recipeDoesNotExistMessage(): Message {
  const list: string[] = [
    'What is that? Ugh!',
    'Yuck!',
    'Bleh! What have I done?!',
    'Oh no! How did that happen?!',
  ];

  return {
    text: split(choice(list)),
    rightSide: true,
  };
}

export function recipeWithoutOrderMessage(): Message {
  const list: string[] = [
    "This is good, but why I've made this?",
    'Nobody wants this.',
    'Good potion, bad thinking.',
    "I've messed up some orders.",
  ];

  return {
    text: split(choice(list)),
    rightSide: true,
  };
}

export function dayOverMessage(): Message {
  return {
    text: split("It's getting late. Time to close the store."),
    rightSide: true,
  };
}
