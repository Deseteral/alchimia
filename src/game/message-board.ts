export interface Message {
  text: string[],
  rightSide: boolean,
}

export interface MessageBoard{
  messages: Message[],
}
