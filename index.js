const {TerminalUI, Sources} = require('./terminal-uiClass')


const t = new TerminalUI()
//t.addSource(Sources['lelscan'])
t.setDefaultSources()


//t.addSource(lelscanSource)

t.startUI()
