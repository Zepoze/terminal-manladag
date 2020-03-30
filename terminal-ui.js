'use strict';
const fs = require('fs')
const Path = require('path')
const PathDownload = Path.join(__dirname,'Mangas')
const consola = require('consola')
var inquirer = require('inquirer');

function createChapterFolder(source,manga_index,chap) {
    let dir
    
    if (!fs.existsSync(dir = `${PathDownload}`)){
        fs.mkdirSync(dir);
    }

    if (!fs.existsSync(dir = `${PathDownload}/${source.mangas[manga_index].name}`)){
        fs.mkdirSync(dir)
    }

    if (!fs.existsSync(dir = `${PathDownload}/${source.mangas[manga_index].name}/${chap}`)){
        fs.mkdirSync(dir)
    }
}
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
        if(sources!=0) {
            let a = await inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'source',
                    message: 'Which Source?',
                    choices: [
                        ...sources.map((e,i) => { return { name: e.site, value: i }}),
                        new inquirer.Separator(),
                        { name: 'Exit', value: -2}
                    ]
                }
            ])
            
            if(a.source!=-2) selectManga(sources[a.source])
        } else {
            consola.error('No source setted ??')
            await new Promise((resolve,reject) => {
                setTimeout(resolve, 2000)
            })
        }


    }

    async function selectManga(source) {
        let a = await inquirer
        .prompt([
            {
            type: 'list',
            name: 'manga',
            message: `${source.site} Mangas`,
            choices: [
                ...Object.values(source.mangas).map((e,i) => { return { name: e.name, value: i }}),
                new inquirer.Separator(),
                { name: 'Select an other Source', value: -1},
                { name: 'Exit', value: -2}
            ]}
        ])

        if(a.manga == -1) startUI();
        else if(a.manga == -2) return 0;
        else selectChapter(source,Object.keys(source.mangas)[a.manga]);
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
                    createChapterFolder(source,manga_index,chapter)
                    const path = await source.downloadChapter(manga_index,chapter,Path.join(PathDownload,source.mangas[manga_index].name,chapter.toString(10)))
                    if(typeof(path) == 'string') {
                        await source.processChapter(path, manga_index, chapter, { pdf: true, zip: true})
                    }
                }catch(e) {

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
                    createChapterFolder(source,manga_index,b.chapter)
                    const path = await source.downloadChapter(manga_index,b.chapter,Path.join(PathDownload,source.mangas[manga_index].name,b.chapter.toString(10)))
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

