` @todo`;
{
  /*
  updated real time title + color when create/edit syndicate_forum  
  save acros browser reload
  multiple windows support
  make id for tabs persistent across browser reload
  highlight all members when moving syndicate

*/
}

`@bugs`;
{
  /*
  e bugul ala ca dispar taburi uneori vezi cum poti sa dai exploit la asta
  forums can be membru in alt syndicate 

*/
}

`@hmm`;
{
  /*  
  ?delete syndicate on last member removed? 
  ?better toggle pe rotita? si drag pe mouse (click and drag)?

  ?make modifiable key (eg:ctrl) change behaviour of onActived on forum 
    + change favicon accordingly

  on syndicate move close all other syndicates to look better

  members must have inside their favicon a badge showing 
    their allegiance to the syndicate. This can be done
    by using the canvas or embeding it's favicon inside
    a custom svg: https://stackoverflow.com/questions/30897108/how-can-i-display-an-image-inside-svg-circle-in-html5

  change context menu acording to tabs category (member, forum, non member) 
    browser.menus.onShown.addListener(async (info, tab) => {
      browser.menus.update(menuId , …);
      // Note: Not waiting for returned promise.
      browser.menus.refresh();
    });
*/
}

`@done`;
{
  /*
  repara bugurile cu nu poate sa dea focus ca e prea in dreapta
  listen for tab close to potentially remove it from any group
  sa se invarta un morcov ca loading stuff
    si sa arate drept asa ----> daca sunt deschise
    si in sus daca sunt inchise
  
*/
}
