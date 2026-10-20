# Photographs for the site

Drop a file at the path below and it appears. Until then the slot shows a
quiet brand frame, so nothing looks broken.

Everything here follows Imagery in the brand guidelines: our own session
photography, unposed, natural light, saturation down 10 to 15, text never
sitting on a busy photo. No stock futurism, no AI-generated people or
places, no photographs of swans.

## Slots waiting for a file

| Path | Page | Crop | Shot brief |
| --- | --- | --- | --- |
| `img/sensing-polytechnic.jpg` | work.html, case 1 | 16:9 | The wall at the end of a sensing review, full and messy. |
| `img/catapult-sight-beyond-sight.jpg` | work.html, case 2 | 16:9 | Hands sorting provocation cards during Sight Beyond Sight. |
| `img/interfaith-fishbowl.jpg` | work.html, case 3 | 16:9 | Three faces in a fishbowl practicum, none looking at the camera. |
| `img/hr-futures-wheel.jpg` | work.html, case 4 | 16:9 | The facilitator listening while HR leads build a futures wheel. |

## Already filled

| Path | Page | Crop |
| --- | --- | --- |
| `img/session-futures-wheel.jpg` | index.html hero | 16:10 |

## How to fill a slot

In the page, replace

    <div class="shot-frame empty"> ... </div>

with

    <div class="shot-frame"><img class="fs-photo" src="img/NAME.jpg" alt="..."></div>

Write a real alt description, not "photo". Then run `python3 build.py`.

## Portraits

The three people on index.html use initials in ink circles. Swap them for
1:1 portraits only when all three exist. One photograph beside two
monograms looks worse than three monograms.

## Still to source

- **Stones as still life**, for anything about values: real stones, single
  or in small groups of five, on paper or dark slate, lit from one side.
  Never stacked into towers, which reads as spa and wellness.
- **The launch photographs.** GUILD Asia's 5 May post has five frames at
  960 x 1279, already the 4:5 social crop. Ask Ibnur for the originals
  rather than saving them from Facebook: better resolution, and the
  consent question is answered at source.

## Consent

Signed photo consent from everyone recognisable, stored with the image.
Ask the client before showing their staff, rooms or materials. Public
sector clients may need agency approval.
