const UI = require('manladag').UI
const _startUI = require('./terminal-ui').startUI
const consola = require('consola')
class TerminalUI extends UI {
    
    constructor() {
        super(TerminalUI)
        this.startUI()
    }

    startUI() {
        _startUI()
    }

    static onPageDownloadFinished ({ page, nbPages }) {
        consola.success(`Page ${page}/${nbPages} downloaded !`)
    }

    static onNumberOfPage(nbPages) {
        consola.info(`contain ${nbPages} pages`)
    }
    static onPageDownloadError({ error, page }) {
        consola.error(error.message)
        consola.info(`error in page ${page} download`)
    }

    static onChapterDownloadStarted({ manga, chapter }) {
        console.log('---------------------')
        consola.info(`The download of ${manga} ${chapter} start!`)
    }

    static onChapterDownloadFinished({ manga, chapter }) {
        consola.success(`${manga} ${chapter} downloaded !`)
        consola.log('----------------------')
    }

    static onChapterDownloadError() {
        consola.info('chapter download failed !')
    }

    static onStrategieMissing(e) {
        consola.error(e)
    }

    static onChapterZipStarted({ source, manga, chapter }) {
        consola.info('zip started')
    }

    static onChapterZipFinished({ source, manga, chapter }) {
        consola.info('zip finished')
    }

    static onChapterZipError({ source, manga, chapter, error }) {
        consola.error(error)
        consola.info('zip failed')
    }

    static onChapterPdfStarted({ source, manga, chapter }) {
        consola.info('pdf started')
    }

    static onChapterPdfFinished({ source, manga, chapter }) {
        consola.info('pdf finished')
    }

    static onChapterPdfError({ source, manga, chapter, error }) {
        consola.error(error)
        consola.info('pdf failed')
    }
}




module.exports = TerminalUI