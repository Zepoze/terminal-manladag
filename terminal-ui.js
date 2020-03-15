'use strict';
const consola = require('consola')
const sources = require('manladag').Sources
var inquirer = require('inquirer');

const tmp = async (s,m) => {
    if(typeof(s._getLastChapter) == 'function') return { name: `Download last chaper (${await s.getLastChapter(m)})`, value: 0 };
    else return {disabled: 'no strategie', name:'Download last chapter'};
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
    let a = await inquirer
    .prompt([
        {
        type: 'list',
        name: 'action',
        message: 'Select an Action',
        choices: [
            { name: 'Download a chapter', value: 1},
            await tmp(source,manga_index),
            new inquirer.Separator(),
            {name: 'Select an Other Manga', value: -1}
            ,
            {name: 'Exit', value: -2}
        ]}
    ])

    switch(a.action) {
        case 0:
            let chap = await source.getLastChapter(manga_index)
            consola.info(`The last chapter : ${chap}`)

            await source.downloadChapter(manga_index,chap)
            selectManga(source)
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
            const path = await source.downloadChapter(manga_index,b.chapter)
            if(typeof(path) == 'string') {
                try { 
                    //await source.zipChapter(manga_index,b.chapter,path)
                    //await source.pdfChapter(manga_index,b.chapter,path)
                    await source.processChapter(path, manga_index, b.chapter, { pdf: true, zip: true})
		    
	            } catch(e) {
	                consola.error(e)
	            }
            }
            selectManga(source)
            
            break
        case -1:
            selectManga(source) 
            break
        case -2:
            return 0
    }

}

module.exports.startUI = startUI
