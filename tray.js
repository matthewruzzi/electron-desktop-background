'use strict';
const { app, Menu, Tray, nativeImage } = require('electron');
const path = require("path")
const config = require('./config');
const prompt = require('electron-prompt');
const { set } = require('./config');

let tray = null;
console.log("tray");

function urlPrompt(win, tray) {
    prompt({
        title: 'Prompt example',
        label: 'URL:',
        value: config.get('backgroundUrl'),
        inputAttrs: {
            type: 'url' // TODO: better validation
        },
        type: 'input'
    })
        .then(r => {
            if (r === null) {
                console.log('user cancelled');
            } else {
                (async () => {
                    console.log('result', r);
                    await win.loadURL(r);
                    config.set('backgroundUrl', r);
                    setTray(win, tray);
                })();
            }
        })
        .catch(console.error);
}

function setTray(win, tray) {
    const contextMenu = Menu.buildFromTemplate([
        { label: win.getTitle(), type: 'normal', enabled: false },
        { label: config.get('backgroundUrl'), type: 'normal', enabled: false },
        { type: 'separator' },
        {
            label: 'Set URL…', type: 'normal', click() {
                urlPrompt(win, tray);
            }
        },
        { type: 'separator' },
        {
            label: 'Reload', type: 'normal', click() {
                win.reload();
            }
        },
        //        { type: 'separator' },
        //        { label: 'Desktop Background Mode', type: 'normal'/*, checked: true*/, click() { win.type = "desktop"; } },
        //        { label: 'Browsing Mode', type: 'normal', click() { win.type = "textured"; } },
        { type: 'separator' },
        { role: 'about', label: 'About' },
        // { label: 'Preferences…', type: 'normal' },
        { type: 'separator' },
        { role: 'quit' }
    ]);
    tray.setToolTip('Electron Desktop background');
    tray.setContextMenu(contextMenu);
}

function createTray(win) {
    const icon = nativeImage.createFromDataURL('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAABN1JREFUeJzFVllsVFUY/u499850ZmgLLWUpS8rSmgJlECjpQqUsseWBJRV4IFbjSiJRHwzBBx6NweiLGp7UGERfQNCEaiTsS1kFYQZrKUIrlOBSGFqYpb3L+J17Z9riDL6Y4E1Ozp175/zf/33/djU8hkv7X0CM9c0BS1WDlipGmarQTVXDgMaV2g2ho18uTedvHQnNw3sPd93gs4ghtEsvvNUcfSSIub55oa0oW5OKUmErqs9SVEFAcIezqwKmOvw+vVSYQlh0KE7A8Ifb9mx+c2NTawaIZJBUsJXGa4cdhMF7g7spNCQIds+0IPQcmFqKYYrRgNBV7vqA0GrJ9r13Pv2hYcvLjdGHQOh9kCwqJIDrJaWRS7iLh7H3Shta2i+jftZcLJ5bTdk8jmxZ1myeDdLsyYdAKEmBrap+yWDIe+GCqC7I9XsR3IlFsfvHVuSOHouy0lmSgROjFJv07uP5ggy5aFBQKkUaTrOIU55e00TMsiFoYEVlLaaUTEc/n39z6gjWF02AJ5+2KJ8DJuVzgDSFNkQGiKUIJ6AOAIFuxmP4LPQTuu73UkqBkrHFWFVdD38gF+FrVxDtT+DL73eC7DGqqBjVjWvgLRznZh2BpBqZgRcuiNwj9PzdU8ewYEop1tFwglKdvdmFD1p2IYcgFeVzUDpzHvbs/xbrmt/Azx2XcXDfbtSt24BkTsABMrOBpAMuZbqTiKHPMLBsRhB9dhKfnziImG1jZf1yjJtQQkN+RJhlXl8ABiUqr1qC9i8+wn2y8+SPdmpJxjYLE80F4e71B+BhgR3tvIYDHW2YMfUJ1MypgjoiF1GwRuip4vVDJ0hf/wASf96GIEOMyHfTmjayMjFSL+Tu8fhQU1aOHWeP4+l5tVg0fyFMTw66+3px6NxxVNY1wM+gaz4/emMP0Hb+BCbOqYYiQVLpbv0biJMdQkqWgC/Hh3uJOLNMQZLeJ70+5DCbLDohU1V2gqgxgLzJ0zF+bh2lc8+6qmSRK01R0u2hBOdvdOK5hiYcunwBXx3Yi/pFy+EfU4yapaucfhXnfxOMgX/cZIxZsJSOgJk2VLxZQdxguUyuR37HrUgPwt1dWE2gwxfPYMee7XiSAS6pqITKeNzv70ecLAWZhffvxu2rYZSueRWBsuBgEmWAyKq1RArkbg8KePhSZweqnlqOQH4hahevQPiXizh97hgKJ05F/qRpMJhxd/7oRsfRFhakF391tsNTPs/J0Ecw0Zw2IrWeP7sSSQZxDNPVYsBjlolbBFyy9hX0sDhv/HYVoSPfwTOyAL+eOYzJy56BXjgWI2VcVLcdyXhlMuE84EubjIQnz4/5zCh3VuiYFqxGeOcnCF04ieJgFUwo8BWNR+WGLbDpjCGGAp5KIJsgRrbAR9jO4wy8Ptj0hNuLRG4AVSufReu+rxE6dwTeUUWY2fQSEMhzRoDTTFOzxZ01apx9MJJZ8UKEON3ClKs2PfWGt+/cSdNR9+ImPGAnSNK4zZWuifRIGARS1DBHRygDZPWW16I73t++mZ5v5Zot2zWXGGrfGmzWiZarD9bSoGG371mSAQFCBHj7dE1eNANEXs2bnm/d9vGuRkpQQQkK5Yy3hDtqh6/BEay472zFuR/g0LtLMyECxIbbzfiQ2Pj6WunB6X8+/y/XY/kk+hvEDCL/+QVJawAAAABJRU5ErkJggg==')
    tray = new Tray(icon)
    setTray(win, tray);
}

module.exports = createTray;
