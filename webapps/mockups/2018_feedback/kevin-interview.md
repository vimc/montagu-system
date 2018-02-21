# Kevin (LSHTM-Jit and LSHTM-Clark)
Chrome & Firefox on Windows

## Misc
* says he sometimes gets a message saying he's logged out but can still see content
* had tried logging in to admin and was a little confused that he was allowed to do so
* expressed interest in API
* keen to see diagnostic report in the portal/asap after uploading estimates

## Navigation
* navigated to guidance page via responsibilities and then breadcrumb lead back to home,
 so ended up back at home and had to click though the chain of pages again - expressed that this was disorienting
 * "I don't really know what touchstone means" (although he then did accurately explain what a touchstone is)
 * had multiple open touchstones, with open responsibilities split across touchstones, this was annoying/confusing bc
  you have to pick a touchstone on page 1, but then discover you've selected the wrong one (hard to rmr which diseases
   have open responsibilities in which touchstone)
* "would you ever have to go back to an old touchstone?" why are they listed? had never clicked on a past finished
touchstone before - we discovered you can't download old coverage data but you can download old demographic data
* "I always try to click on this" - the title of the scenario card
* "I don't really care about the modelling group" - disease is the top level concept for him
* if you filter on disease on responsibility page, navigate to scenario, then click back it doesn't remember
 the disease filter

## Suggested redesign
* Would put all information on responsibility page on a separate page
* Have a top menu navigation with links to demographic data, disease pages, guidance
* One page per disease

## Downloading
* demographic data easy to use but 5 second timeout meant button was re-enabled before file had downloaded,
 which was confusing
* coverage data no vacc - their model needs 0 valued data whereas our csv is empty so he never downloads ours
 but creates his own
* has adapted model to use coverage data in the format we deliver it

## Uploading
* uploading params, after choosing 'single run' type, just always wrote 'N/A' in the description field
 (and had to ask Kim what it meant/what to put)
* wants to see what file has been uploaded or first 5 rows or be able to re-download so can confirm uploaded
  the right file
* was afraid that just navigating to the upload page might trigger an action/overwrite something even if he hadn't
 re-uploaded estimates
* had made accidents uploading wrong csv file and had informative error that helped him correct (wrong disease),
but also had experienced a bug where a generic error message came back and he wasn't able to debug
* couldn't upload during interview due to excel bug
* asked why we need a param certificate
* his natural param set csv would have had column country, mortality column, run id column, i.e. a custom long format
- wondering if that could ever be accommodated

## Interpretation

My main takeaway from this session was that navigating the app is the biggest pain point. The responsibilities overview
page is serving as a kind of menu for all the things a user wants to do, and a persistent menu bar across all pages
would be better. Requiring the user to pick a modelling group and a touchstone before they can navigate any further
doesn't represent the way the user thinks about the tasks they're trying to do and means if they accidentally select the
wrong one, they have to go back to the home page and start the 1 directional journey through the app again. Touchstone
and group are also the least meaningful concepts to the user. Disease and type of action (download/upload)
are the most meaningful. Buttons that navigate to a page can be mistaken for actions (fear over clicking
'upload estimates' in case triggered some action.)

Mostly the individual components worked well. Improvements there:
1. only prompt for info about how estimates were calculated if user has already indicated that they are not
derived from a single model run.
2. show filename, or file preview of uploaded estimates
3. explain param certificate
4. integrate diagnostic report
5. make scenario descriptions clearer
6. possibly provide zero valued coverage data for no vacc, or don't bother having a download link there at all
as there's no point downloading an empty file