'use strict';
const Path = require('path')
const consola = require('consola')
var inquirer = require('inquirer');
module.exports.startUI = (sources) => {
    const tmp = async (s,m) => {
        const tab = [
            { name: 'Download a chapter', value: 1},
            new inquirer.Separator(),
            {name: 'Select an Other Manga', value: -1},
            {name: 'Exit', value: -2}
        ]
        let last
        try {
            if(typeof(s._getLastChapter) == 'function') {
                last = await s.getLastChapter(m)
                tab.splice(1,0,{ name: `Download last chaper (${last})`, value: 0 })
            }
            else {
                tab.splice(1,0,{disabled: 'no strategie', name:'Download last chapter'})
            }
        } catch(e) {
            tab.splice(1,0, {disabled: 'Error', name:'Impossile to get last chapter'})
            
        } finally {
            return {choices:tab,chapter: last}
        }
    }

    async function startUI() {
        let a = await inquirer
        .prompt([
            {
            type: 'list',
            name: 'source',
            message: 'Which Source?',
            choices: sources.map((e,i) => { return { name: e.site, value: i }})
            }
        ])
        
        selectManga(sources[a.source])


    }

    async function selectManga(source) {
        let a = await inquirer
        .prompt([
            {
            type: 'list',
            name: 'manga',
            message: `${source.site} Mangas`,
            choices: [
                ...source.mangas.map((e,i) => { return { name: e.name, value: i }}),
                new inquirer.Separator(),
                { name: 'Select an other Source', value: -1},
                { name: 'Exit', value: -2}
            ]}
        ])

        if(a.manga == -1) startUI();
        else if(a.manga == -2) return 0;
        else selectChapter(source,a.manga);
    }


    async function selectChapter(source,manga_index) {
        const { choices, chapter } = await tmp(source,manga_index)


        let a = await inquirer
        .prompt([
            {
                type: 'list',
                name: 'action',
                message: 'Select an Action',
                choices: choices
            }
        ])

        switch(a.action) {
            case 0:
                try {
                    await await source.downloadChapter(manga_index,chapter)
                    if(typeof(path) == 'string') {
                        await source.processChapter(path, manga_index, b.chapter, { pdf: true, zip: true})
                    }
                } finally {
                    selectManga(source)
                }
                break
            case 1:
                let b = await inquirer
                .prompt([
                    {
                    type: 'input',
                    name: 'chapter',
                    message: 'type a chapter',
                    validate: (value) => (parseInt(value) >=0) ? true : 'Come on bro it should be a number'
                    }
                ])
                b.chapter = parseInt(b.chapter)
                try {
                    const path = await source.downloadChapter(manga_index,b.chapter)
                    if(typeof(path) == 'string') {
                        await source.processChapter(path, manga_index, b.chapter, { pdf: true, zip: true})
                    }
                } 
                finally{
                    selectManga(source)
                }
                
                break
            case -1:
                selectManga(source) 
                break
            case -2:
                return 0
        }

    }
    return startUI
}

