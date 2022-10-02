# Alchimia

> You’ve just graduated from The Magic School.
>
> Congratulations!
>
> After 10 long years of studying and dreaming about your favorite place on the Continent you can finally fulfill your dreams.
>
> You take a small load and open your own potion shop. Will you be able to run your store and pay off the debt?

![Cover image](promo_assets/itch_cover.png?raw=true "Cover image")

My game for [Ludum Dare 51](https://ldjam.com/events/ludum-dare/51/alchimia).
You can play it on [my itch.io page](https://deseteral.itch.io/alchimia).

## Building
```sh
npm i && npm run build
```

## Brainstorming notes
**Theme: Every 10 seconds**

You're in charge of running a fantasy potion shop

Game is separated into play sessions - in game days.
Each day new client comes in every 10 seconds.
Every client has a list of potions they want to buy.

You have a list of recipes for different potions.
Each recipe contains:
- ingredients list
- each ingredient has associated action that has to be performed on it
- time of preparation

Each action is a minigame.
There are multiple screens for each stage of potion preparation.

When ingredients are prepared they go to brewing station where they go into the cauldron for some time.

The game starts easy with limited ingredients and recipes. As you progress you unlock new stuff. The game also gets harder as new clients want to buy more than one potion.

### Ingredient actions
- cutting (button mashing)
- griding (mouse spinning?)
- burning (keeping falling indicator in the right place)
- enchanting (qte)

## License
This game is licensed under the [MIT license](LICENSE).
