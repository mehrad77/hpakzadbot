
var _ = require("lodash");
var TelegramBot = require('node-telegram-bot-api');
const low = require('lowdb')
const fileAsync = require('lowdb/lib/storages/file-async')
const id = 188406252; //mehrad id
const zo = 90874309; // zohre id
const db = low('database.json', {
  storage: fileAsync
})
db.defaults({ users: [], user: {} })
  .write()

var token = "203511092:AAEMxqUW46BH-8jHViug6box5AkAYDDHCxs";
// Change this to wenhook fastest as you can (‍‍‍~mehrad)
var bot = new TelegramBot(token, { polling: true });
console.log("[...]Conected...");
var ostan = ["آذربایجان شرقی","آذربایجان غربی","اصفهان","البرز","ایلام","بوشهر","تهران","چهارمحال و بختیاری","خراسان جنوبی","خراسان رضوی","خراسان شمالی","خوزستان","زنجان","سمنان","سیستان و بلوچستان","فارس","قزوین","قم","کردستان","کرمان","کرمانشاه","کهگیلویه و بویراحمد","گلستان","گیلان","لرستان","مازندران","مرکزی","هرمزگان","همدان","یزد"];


var replyKayboardMobile = {keyboard:[[{text: "بفرست",request_contact: true}]],"one_time_keyboard":true};
var replyKayboardGender = {keyboard:[[{text: "مرد"}, {text: "زن"}]],"one_time_keyboard":true};

var intro = "به ربات رسمی هادی‌پاکزاد خوش‌آمدید. توسط این ربات می‌توانید ترانه‌ها و آهنگ‌ها و ... هادی پاکزاد را دریافت کنید. برای دریافت آهنگ مدنظر خود نام آن را جست‌وجو کنید یا از منوهای زیر یکی را انتخاب کنید.";
bot.onText(/((\/start|start|شروع))\b/,  function (msg, match) {
    
});


function dbLog(chatid,first_name,username,content){
    bot.sendMessage(id, chatid+" == "+first_name+" == @"+username+ "==>" +content);
    let chatIdExist = db.get('users').find({ id: chatid }).value()
        console.log("chatId",chatIdExist);
    if(chatIdExist){
        console.log("chatId Exist",chatIdExist);
    }
    else {
        let test = db.get('users')
        .push({ id: chatid, first_name: first_name,username:username})
        .write();
        console.log("writen: " + chatIdExist);
    }
}


bot.on('text',  function (msg, match) {
    var title = msg.text;
    dbLog(msg.chat.id,msg.from.first_name,msg.from.username,msg.text);
    console.log("title");
    if (msg.chat.id == id){
        if ( /^send.*/igm.test(title)){
            var text = title.substr(5);
            console.log(text);
            var obj = JSON.parse(text);
            bot.sendMessage(obj.id, obj.text);
            bot.sendMessage(id,"!!"+ obj.text + "!! sent");
            return false;
        }
        else if ( /^sent.*/igm.test(title)){
            var text = title.substr(5);
            console.log(text);
            var obj = JSON.parse(text);

            let chatIds = db.get('users').value()
            var useresWhoSent = " ";
            var count = 0;
            for (var i = 0, len = chatIds.length; i < len; i++) {
                console.log("chatIds sent ..",chatIds[i].username);
                bot.sendMessage(chatIds[i].id, obj.text);
                useresWhoSent = useresWhoSent + " @" + chatIds[i].username;
                count++;
            }
            bot.sendMessage(id, "messege sent to "+ count + ": " + useresWhoSent);
            return false;
        }
        else if ( /^zoooo.*/igm.test(title)){
            for (var prop in hadi) {
                      console.log(prop + "sent");
                      bot.sendMessage(id, "lyric:" + hadi[prop]);
                }
        }
    }
    

    var keys =[]
    console.log("["+msg.from.first_name+"|"+msg.from.username+"][text]==> ",title);
    var lyrc = searchObj(songs, title.toLowerCase(),""); out = []; //Always Clear out !
    sent = `لطفا ترانه مورد نظر خود را انتخاب کنید.`;
    lyrc.forEach(function(entry) {
        //sent += '\n\n\n\n'+ hadi[entry];
        keys.push( [{ text: songs[entry][1], callback_data: songs[entry][0] }] );
    });
    if(keys.length <= 0){
        sent = `‍نتیجه‌ای برای جست‌و‌جوی شما یافت نشد،برای دریافت آهنگ مدنظر خود نام آن را جست‌وجو کنید یا از منوهای زیر یکی را انتخاب کنید.`;
        if((/((\/start|start|شروع))\b/.test(title))) sent = intro;
        bot.sendMessage(msg.chat.id, sent,mainKey);
        bot.forwardMessage(id, msg.chat.id, msg.message_id);
    }

    else{
        var options = {
            parse_mode:"HTML",
            reply_markup: JSON.stringify({
                inline_keyboard: keys
            })
        };
        bot.sendMessage(msg.chat.id, sent, options);
        bot.forwardMessage(id, msg.chat.id, msg.message_id);
    }
});


bot.on('audio',  function (msg, match) {
    	bot.sendMessage(id, msg.audio.file_id + "\n\n"+ msg.audio.title);
});

bot.on('video',  function (msg, match) {
    	bot.sendMessage(id, msg.video.file_id + "\n\n"+ msg.video.file_size);
});



bot.on('callback_query', function onCallbackQuery(callbackQuery) {
    const action = callbackQuery.data;
    const msg = callbackQuery.message;
    console.log("["+callbackQuery.from.first_name+"|"+callbackQuery.from.username+"][callback_query]==> ",action);
    
    dbLog(callbackQuery.from.id,callbackQuery.from.first_name,callbackQuery.from.username,action);
    const opts = {
        chat_id: msg.chat.id,
        message_id: msg.message_id,
    };
    let text;
    if (/(get_song_)\w+/g.test(action)){
        text = action.substr(9);
        var options = {
            parse_mode:"HTML",
            reply_markup: JSON.stringify({
                inline_keyboard: [[{ text: "📥 دریافت شعر", callback_data: "get_lyrics_"+text }]]
            })
        };
        bot.sendAudio(msg.chat.id, music[text], options);
        bot.answerCallbackQuery(callbackQuery.id, " ارسال شد.",false);
    } 
    else if(/(btn_)\w+/g.test(action)){
        text = action.substr(4);
        switch(text) {
            case "albumfl":
                //bot.editMessageText("آلبوم سرزمین وحشت", opts);
                bot.editMessageReplyMarkup(flKey,opts);
                break;
            case "albumlu":
                //bot.editMessageText("آلبوم سرزمین وحشت", opts);
                bot.editMessageReplyMarkup(luKey,opts);
                break;
            case "albumdr":
                //bot.editMessageText("آلبوم سرزمین وحشت", opts);
                bot.editMessageReplyMarkup(drKey,opts);
                break;
            case "albumaf":
                //bot.editMessageText("آلبوم سرزمین وحشت", opts);
                bot.editMessageReplyMarkup(afKey,opts);
                break;
            case "albumff":
                //bot.editMessageText("آلبوم سرزمین وحشت", opts);
                bot.editMessageReplyMarkup(ffKey,opts);
                break;
            case "albumcwd":
                //bot.editMessageText("آلبوم سرزمین وحشت", opts);
                bot.editMessageReplyMarkup(cwdKey,opts);
                break;
            case "albumvc":
                //bot.editMessageText("آلبوم سرزمین وحشت", opts);
                bot.editMessageReplyMarkup(vcKey,opts);
                break;
            case "albumsingle":
                //bot.editMessageText("آلبوم سرزمین وحشت", opts);
                bot.editMessageReplyMarkup(singlesKey,opts);
                break;
            case "main_Key":
                //bot.editMessageText(intro, opts);
                bot.editMessageReplyMarkup(main_Key,opts);
                break;
            case "video":
                //bot.editMessageText(intro, opts);
                bot.editMessageReplyMarkup(videosKey,opts);
                break;
            case "official_video":
                //bot.editMessageText(intro, opts);
                bot.editMessageReplyMarkup(official_video,opts);
                break;
            case "unofficial_video":
                //bot.editMessageText(intro, opts);
                bot.editMessageReplyMarkup(unofficial_video,opts);
                break;
                
            case "full":
                for (var prop in music) {
                    var options = {
                        parse_mode:"HTML",
                        reply_markup: JSON.stringify({
                            inline_keyboard: [[{ text: "📥 دریافت شعر", callback_data: "get_lyrics_"+prop }]]
                        })
                    };
                      bot.sendAudio(msg.chat.id, music[prop], options);
                }
                break;
            default:
                console.log("God Damn ERORR!");
        }
        bot.answerCallbackQuery(callbackQuery.id);
    }
    else if (/(get_lyrics_)\w+/g.test(action)){
        text = action.substr(11);
        sendLyric(text,opts);
        bot.answerCallbackQuery(callbackQuery.id, " ارسال شد.",false);
    }
    else if (/(get_video_)\w+/g.test(action)){
        text = action.substr(10);
        sendVideo(text,opts);
        bot.answerCallbackQuery(callbackQuery.id, " ارسال شد.",false);
    }
    else {
        text = action;
        sendEditLyric(action,opts);
        bot.answerCallbackQuery(callbackQuery.id, " ارسال شد.",false);
    }
    

  
    
   
});

    
function sendLyric(songID,opts){
    let text = hadi[songID];
    var options = {
        parse_mode:"HTML",
        reply_markup: JSON.stringify({
            inline_keyboard: [[{ text: "📥 دریافت آهنگ", callback_data: "get_song_"+songID }]]
        })
    };
    bot.sendMessage(opts.chat_id,text, options);
}
function sendVideo(videoID,opts){
    let text = video[videoID];
    var options = {
        parse_mode:"HTML",
        caption:songs[videoID][1]
        // reply_markup: JSON.stringify({
        //     inline_keyboard: [[{ text: "📥 دریافت آهنگ", callback_data: "get_song_"+videoID }]]
        // })
    };
    bot.sendVideo(opts.chat_id,text, options);
}
function sendEditLyric(songID,opts){
    let text = hadi[songID];
    let rply = JSON.stringify({
        inline_keyboard: [[{ text: "📥 دریافت آهنگ", callback_data: "get_song_"+songID }]]
    });
    bot.editMessageText(text, opts);
    bot.editMessageReplyMarkup(rply,opts);
}

bot.on("inline_query", (query) => {
    if (query.query != ""){
        console.log("["+query.from.first_name+"|"+query.from.username+"][inline_query]==> ",query.query);
        var lyrc = searchObj(songs, query.query.toLowerCase() ,""); out = []; //Always Clear out !
        sent = [];
        lyrc.forEach(function(entry) {
            var obg = {
                        type: "article",
                        id: entry,
                        thumb_url: 'http://bayanbox.ir/view/1099161085314589891/2012-Earth.jpg',
                        title: songs[entry][1],
                        description: hadi[entry].substring(0, 100)+"...",
                        input_message_content: {
                            message_text: hadi[entry]
                        }
                    }
            sent.push(obg);
        });


        

    bot.answerInlineQuery(query.id, sent);
    }
});

// bot.on('contact', (msg) => {
// 	if (msg.contact.user_id == msg.from.id)
// 		user.findOneAndUpdate({chatID: msg.chat.id
// 		}, {$set: {phoneNumber: msg.contact.phone_number}
// 		}, {}, function(){
// 			console.log("phoneNumber Achived");
// 			new ask(msg.chat.id, "done");
// 		})
// 	else
// 		bot.sendMessage(chatID, "لطفا شماره موبایل این حساب تلگرام را بفرستید.", {parse_mode:"HTML", reply_markup: replyKayboardMobile });
		
// });



var out = [];
function searchObj(obj, query,motherObj) {
    var preItm = "";
    for (var key in obj) {
        var value = obj[key];
        if (typeof value === 'object') {
            searchObj(value, query,value[0]);
        }
        if (value.includes(query)) {
            if (preItm != motherObj){
                out.push(motherObj);
                preItm = motherObj;
            }

            
              //console.log(query);
        }
    }
    return out;
}



var songs = {

    DarYad: ['DarYad',`دریاد`,`در یاد`,`daryad`,`dar yad`],
    MaraMibini: ['MaraMibini',`مرا می‌بینی`,`مرا میبینی`,`mara mibini`],
    Man: ['Man',`من`,`i`],
    Ashofte: ['Ashofte',`آشفته`,`اشفته`,`ashofte`],
    Daghigheha : ['Daghigheha',`دقیقه‌ها`,`daghigheha`,`daghighe ha`],
    GoleParpar : ['GoleParpar',`گل پرپر`,`gole parpar`,`پر پر`],
    SafheyeAkhar: ['SafheyeAkhar',`صفحه آخر`,`safheh akhar`],

    Adamahani : ['Adamahani',`آدم آهنی`,`adam ahani`],
    vasemanyavaseona: ['vasemanyavaseona',`واسه من یا واسه اونا؟`,`vase man ya vaseh ona`],
    ShesmyMom : ['ShesmyMom',`She's My Mom`,`my mom she`],
    Ghanoon: ['Ghanoon',`قانون`,`law`,`ghanoon`,`ghanon`],
    Afaterisheh : ['Afaterisheh',`آفت ریشه`,`افت`,`afat e rishe`],
    Zendegizirezamin : ['Zendegizirezamin',`زندگی زیر زمین`,`living`,`underground`],
    Zendaneshishei: ['Zendaneshishei',`زندان شیشه‌ای`,`glass`],
    Extacy: ['Extacy',`اکستازی`,`extacy`],

    TheresNothing: ['TheresNothing',`چیزی نیست`,`چیزی`,`نیست`,`nothing`],
    Dark: ['Dark',`تاریک`,`dark`,`tarik`],
    Book: ['Book',`کتاب`,`book`],
    Redline:['Redline',`خط قرمز`,`red line`],
    MissYourFace : ['MissYourFace',`دلم برای صورتت تنگ شده`,`miss your face`],
    GlassyGuard : ['GlassyGuard',`پیله‌های شیشه‌ای`,`glassy guard`,`glassy`,],
    OrdinaryPerson : ['OrdinaryPerson',`آدم معمولی`,`ادم`,`کلاس`,`ordinary personn`,`master`],
    Doctor: ['Doctor',`دکتر`,`dr`,`doctor`,`پزشک`],

    BloodyMe : ['BloodyMe',`من لعنتی`,`خون`,`bloody me`],
    WhatAboutMe : ['WhatAboutMe',`پس من چی`,`what about me`,`میشه`],
    DeathAngle : ['DeathAngle',`فرشته مرگ`,`death angle`],
    YouDidntHaveTo : ['YouDidntHaveTo',`لازم نبود`,`you didnt have to`,`لازم نبود بمیری`],
    Earth: ['Earth',`زمین`,`earth`,`افلاطون`,`خاک`],
    Chess: ['Chess',`شطرنج`,`شترنج`,`chess`,`سیزده`,`بازی`,`game`],
    FascinatingFlower : ['FascinatingFlower',`'گل دلفریب`,`fascinating flower`,`باغ`,`gole delfarib`],
    Sepehr: ['Sepehr',`سپهر`,`sepehr`],

    TheGun : ['TheGun',`اسلحه`,`تفنگ`,`gun`,`the`,`تیر`,`شکار`],
    MissMyself : ['MissMyself',`دلم برای خودم تنگه`,`miss myself`,`delam tange`],
    WhatDoesItMean : ['WhatDoesItMean',`یعنی چه`,`حافظ`,`what does it mean`],
    ColdAngel : ['ColdAngel',`فرشته سرد`,`cold angle`],
    Postman: ['Postman',`پستچی`,`post`],
    And: ['And',`و`],
    Scientist: ['Scientist',`scientist`,`افلاطون`,`انیشتین`,`اهم`,`نسبیت`,`دانشمند`],
    Ending: ['Ending',`پایان`,`ending`,`انهتا`,`آخر`],

    ArtificialChemistry: ['ArtificialChemistry',`شیمی مصنوعی`,`artificial chemistry`,`shimi masnoei`],
    CommunicationWithTheDeaf: ['CommunicationWithTheDeaf',`ارتباط با کرها`,`communication with the deaf`,],
    YellowHarmony: ['YellowHarmony',`هارمونی زرد`,`yellow harmony`],
    ButtonOfDoom: ['ButtonOfDoom',`کلید انفجار`,`دکتر`,`button of doom`,`دکمه انفجار`],
    UnderneathTheOcean: ['UnderneathTheOcean',`اعماق اوقیانوس`,`underneath the ocean`,`اقیانوس`,`دریا`,`انزوا`],
    People: ['People',`مردم`,`people`,`اجتماع`],
    FreeSpirit: ['FreeSpirit',`روح آزاد`,`ازاد`,`عشق`,`سرد`,`free spirit`],
    NaturesGuilt: ['NaturesGuilt',`گناه طبیعت`,`natures guilt`,`gonah tabiat`],

    FinalRun: ['FinalRun',`فرار آخر`,`final run`,`یخ سرد`,`farar akhar`],
    ONegative: ['ONegative',`اُ منفی`,`او`,`او نگتیو`,`تنها`,`o negative`],
    Eavesdrop: ['Eavesdrop',`شنود`,`eavesdrop`,`shonood`,`shonod`],
    Juggle: ['Juggle',`شعبده`,`juggle`,`شوبده`,`shobade`,`شبده`],
    PackedLife: ['PackedLife',`زندگی بسته‌ای`,`packed life`,,`جعبه`],
    HazeToCelerity: ['HazeToCelerity',`مه تا وضوح`,`haze to celerity`],
    Verticalcemetry: ['Verticalcemetry',`گورستان ایستاده`,`vertical cemetry`],
    TheOneILovedToBe: ['TheOneILovedToBe',`کسی که دوست داشتم باشم`,`The One I Loved To Be`],
    WhereIamFrom: ['WhereIamFrom',`کجایی‌ام`,`where i am from`,`کجا`],

    Sib: ['Sib',`سیب`,`apple`],
    Hanozam: ['Hanozam',`هنوزم`,`هنوز`],
    DesertRose: ['DesertRose',`رز صحرایی`,`desert rose`,`sting استینگ`],
    GreenRobans: ['GreenRobans',`ربان سبز`,`ربان`,`سبز`,`green robans`,`roban e sabz robane`],
    NothingWillGetBetter: ['NothingWillGetBetter',`هیچ چیزی بهتر نمیشه`,`nothing will get better`],
    BlackRose: ['BlackRose',`رز مشکی`,`سیاه`,`black rose`,`گل`,`روز`],
    MercurialFountains: ['MercurialFountains',`فواره‌های جیوه‌ای`,`فواره های جیوه ای`,`mercurial fountains`],
    Xanax: ['Xanax',`زاناکس`,`xanax`,`zanaks`],
    GoodHappening: ['GoodHappening',`اتفاق خوب`,`good happening`],
    Revengemachine: ['Revengemachine',`ماشین انتقام`,`revenge machine`]
}






var music = {
    bahar:`CQADBAADgQEAAq8LYVHqogj1ZZyQZAI`,
    DarYad: `CQADBAADggEAAq8LYVEl1H5V2EYaGwI`,
    MaraMibini: `CQADBAADgwEAAq8LYVGgaCF4qxjZBQI`,
    Man: `CQADBAADhQEAAq8LYVGWcxLSmZeb6wI`,
    Ashofte: `CQADBAADhgEAAq8LYVFJKHSx4sVVIgI`,
    Daghigheha : `CQADBAADiAEAAq8LYVGmydbWWwkMiQI`,
    GoleParpar : `CQADBAADhwEAAq8LYVGsQaNKnXwyggI`,
    SafheyeAkhar:  `CQADBAADiQEAAq8LYVFv7kMvOs9B8gI`,

    Adamahani : `CQADBAADigEAAq8LYVGZOdY_NEAKgwI`,
    vasemanyavaseona: `CQADBAADiwEAAq8LYVFIYLvIU_5W0AI`,
    ShesmyMom : `CQADBAADjAEAAq8LYVGm-aApcsfjMwI`,
    Ghanoon: `CQADBAADjQEAAq8LYVEcwoA_Y1A4eQI`,
    Afaterisheh : `CQADBAADjgEAAq8LYVGbdqDLPT1cdgI`,
    Zendegizirezamin : `CQADBAADjwEAAq8LYVFj3ihIimaaHQI`,
    Zendaneshishei: `CQADBAADkAEAAq8LYVGVgcf-SO9mNgI`,
    Extacy: `CQADBAADkQEAAq8LYVGqcgsf7wzpFQI`,

    TheresNothing: `CQADBAADkgEAAq8LYVGQd8fCu3VI6gI`,
    Dark: `CQADBAADkwEAAq8LYVGb5Zh3ToZtUQI`,
    Book: `CQADBAADlAEAAq8LYVGCIjf6W_R_zgI`,
    Redline: `CQADBAADlQEAAq8LYVEFIEWAhh00VQI`,
    MissYourFace : `CQADBAADlgEAAq8LYVGxwM6HbTcyqAI`,
    GlassyGuard : `CQADBAADlwEAAq8LYVHPZeISkqg57QI`,
    OrdinaryPerson : `CQADBAADmAEAAq8LYVELNu14gKSxjAI`,
    Doctor: `CQADBAADmQEAAq8LYVH3UO6LEVx7yQI`,

    BloodyMe : `CQADBAADmgEAAq8LYVHdBHx-R8QBLQI`,
    WhatAboutMe : `CQADBAADmwEAAq8LYVFP11CA5OsQFgI`,
    DeathAngle : `CQADBAADnAEAAq8LYVEj1Xe9t1THZQI`,
    YouDidntHaveTo : `CQADBAADnQEAAq8LYVGx13KZZpwORwI`,
    Earth: `CQADBAADngEAAq8LYVHkR0t6i5Hu_AI`,
    Chess: `CQADBAADnwEAAq8LYVFj8Nou`,
    FascinatingFlower : `CQADBAADoAEAAq8LYVEgRmkCGLMEGAI`,
    Sepehr: `CQADBAADoQEAAq8LYVFS3O4PQXlVrwI`,

    TheGun : `CQADBAADwQEAAq8LYVFOmANx4OT99AI`,
    MissMyself : `CQADBAADwgEAAq8LYVHr4mWy8pHslQI`,
    WhatDoesItMean : `CQADBAADwwEAAq8LYVHCbypjXYwuzAI`,
    ColdAngel : `CQADBAADxAEAAq8LYVH-TAYFG-A0nwI`,
    Postman: `CQADBAADxQEAAq8LYVEylpVbUZ-JnQI`,
    And: `CQADBAADxgEAAq8LYVGalM9h1SS-DQI`,
    Scientist: `CQADBAADyAEAAq8LYVFG1eMJQS426AI`,
    Ending: `CQADBAADyQEAAq8LYVG53fyY9Rky-QI`,

    ArtificialChemistry: `CQADBAADsgEAAq8LYVGqnI3Aw5VLKgI`,
    CommunicationWithTheDeaf: `CQADBAADtAEAAq8LYVFnfBdUs_guIwI`,
    YellowHarmony: `CQADBAADtQEAAq8LYVHLpyoM62q0WQI`,
    ButtonOfDoom: `CQADBAADtgEAAq8LYVE4bLp_S0Iw`,
    UnderneathTheOcean: `CQADBAADtwEAAq8LYVHhsODIr_ShOwI`,
    People: `CQADBAADuAEAAq8LYVE5O4Ikz1mQbwI`,
    FreeSpirit: `CQADBAADuQEAAq8LYVFybvmyIl9HZQI`,
    NaturesGuilt: `CQADBAADuwEAAq8LYVEGRE_4E9NNbAI`,

    FinalRun: `CQADBAAD0wEAAq8LYVHYIXd40CjaogI`,
    ONegative: `CQADBAAD2QEAAq8LYVEjnwsRh2QcBwI`,
    Eavesdrop: `CQADBAAD0AEAAq8LYVGhYISi82ek1AI`,
    Juggle: `CQADBAAD1wEAAq8LYVEH9WWay0jNkQI`,
    PackedLife: `CQADBAAD2gEAAq8LYVEIt_Qukz3mVQI`,
    HazeToCelerity: `CQADBAAD1gEAAq8LYVF0w6dtSm0Q0AI`,
    Verticalcemetry: `CQADBAAD3gEAAq8LYVFTMU8KsemO_wI`,
    TheOneILovedToBe: `CQADBAAD3QEAAq8LYVEokldlTiWA2wI`,
    WhereIamFrom: `CQADBAAD3wEAAq8LYVHeXmUm_2O7bAI`,

    Sib: ``,
    Hanozam: ``,
    DesertRose: ``,
    GreenRobans: `CQADBAADXwEAAjbc2FB8yf7fPDGHCgI`,
    NothingWillGetBetter: `CQADBAADwAEAAq8LYVHQwbmDsaADuAI`,
    BlackRose: `CQADBAADvAEAAq8LYVFv2xLUEaBumAI`,
    MercurialFountains: `CQADBAADvQEAAq8LYVHL0-aLc4ELGAI`,
    Xanax: `CQADBAADvgEAAq8LYVGSTyL-wMKg0wI`,
    GoodHappening: `CQADBAADvwEAAq8LYVEXd5XiArZzJgI`,
    Revengemachine: `CQADBAADYQADxaFqBWwwXmFL2Zl1Ag`,

    strike:`CQADBAAD2wEAAq8LYVG4IOtfIkfglgI`
}




    var mainKey = {
		parse_mode:"HTML",
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [
                    { text: "سرزمین وحشت", callback_data: "btn_albumfl" },
                    { text: "زندگی زیر زمین", callback_data: "btn_albumlu" }
                ],[
                    { text: "دکتر", callback_data: "btn_albumdr" },
                    { text: "افلاطون", callback_data: "btn_albumaf" }
                ],[
                    { text: "For Four", callback_data: "btn_albumff" },
                    { text: "ارتباط با کرها", callback_data: "btn_albumcwd" }
                ],[
                    { text: "گورستان ایستاده", callback_data: "btn_albumvc" },
                     { text: "تک‌ترانه‌ها", callback_data: "btn_albumsingle" }
                ],[
                    { text: "فول آرشیو", callback_data: "btn_full" }
                ],[
                    { text: "آثار صوتی و ویدیویی", callback_data: "btn_video" }
                ]
            ]
        })
    };

    var main_Key = {
            inline_keyboard: [
                [
                    { text: "سرزمین وحشت", callback_data: "btn_albumfl" },
                    { text: "زندگی زیر زمین", callback_data: "btn_albumlu" }
                ],[
                    { text: "دکتر", callback_data: "btn_albumdr" },
                    { text: "افلاطون", callback_data: "btn_albumaf" }
                ],[
                    { text: "For Four", callback_data: "btn_albumff" },
                    { text: "ارتباط با کرها", callback_data: "btn_albumcwd" }
                ],[
                    { text: "گورستان ایستاده", callback_data: "btn_albumvc" },
                    { text: "تک‌ترانه‌ها", callback_data: "btn_albumsingle" }
                ],[
                    { text: "فول آرشیو", callback_data: "btn_full" }
                ],[
                    { text: "آثار صوتی و ویدیویی", callback_data: "btn_video" }
                ]
            ]
    };

    var flKey = {
            inline_keyboard: [
                [
                    { text: "۱ بهار", callback_data: "get_song_bahar" },
                    { text: "۲ دریاد", callback_data: "get_song_DarYad" }
                ],[
                    { text: "۳ مرا می‌بینی", callback_data: "get_song_MaraMibini" },
                    { text: "۴ من", callback_data: "get_song_Man" }
                ],[
                    { text: "۵ آشفته", callback_data: "get_song_Ashofte" },
                    { text: "۶ دقیقه‌ها", callback_data: "get_song_Daghigheha" }
                ],[
                    { text: "۷ گل پرپر", callback_data: "get_song_GoleParpar" },
                    { text: "۸ صفحه آخر", callback_data: "get_song_SafheyeAkhar" }
                ],[
                    { text: "🔙 بازگشت", callback_data: "btn_main_Key" }
                ]
            ]
    };

    var luKey = {
            inline_keyboard: [
                [
                    { text: "۱ آدم‌آهنی", callback_data: "get_song_Adamahani" },
                    { text: "۲ واسه من یا واسه‌ اونا", callback_data: "get_song_vasemanyavaseona" }
                ],[
                    { text: "۳ She's My Mom", callback_data: "get_song_ShesmyMom" },
                    { text: "۴ قانون", callback_data: "get_song_Ghanoon" }
                ],[
                    { text: "۵ آُفت ریشه", callback_data: "get_song_Afaterisheh" },
                    { text: "۶ زندگی زیر زمین", callback_data: "get_song_Zendegizirezamin" }
                ],[
                    { text: "۷ زندان شیشه‌ای", callback_data: "get_song_Zendaneshishei" },
                    { text: "۸ اکستازی", callback_data: "get_song_Extacy" }
                ],[
                    { text: "🔙 بازگشت", callback_data: "btn_main_Key" }
                ]
            ]
    };

    var drKey = {
            inline_keyboard: [
                [
                    { text: "۱ چیزی نیست", callback_data: "get_song_TheresNothing" },
                    { text: "۲ تاریک", callback_data: "get_song_Dark" }
                ],[
                    { text: "۳ کتاب", callback_data: "get_song_Book" },
                    { text: "۴ خط قرمز", callback_data: "get_song_Redline" }
                ],[
                    { text: "۵ دلم برای صورتت تنگ شده", callback_data: "get_song_MissYourFace" },
                    { text: "۶ پیله‌های شیشه‌ای", callback_data: "get_song_GlassyGuard" }
                ],[
                    { text: "۷ آدم معمولی", callback_data: "get_song_OrdinaryPerson" },
                    { text: "۸ دکتر", callback_data: "get_song_Doctor" }
                ],[
                    { text: "🔙 بازگشت", callback_data: "btn_main_Key" }
                ]
            ]
    };
    var afKey = {
            inline_keyboard: [
                [
                    { text: "۱ من لعنتی", callback_data: "get_song_BloodyMe" },
                    { text: "۲ پس من چی", callback_data: "get_song_WhatAboutMe" }
                ],[
                    { text: "۳ فرشته مرگ", callback_data: "get_song_DeathAngle" },
                    { text: "۴ لازم نبود", callback_data: "get_song_YouDidntHaveTo" }
                ],[
                    { text: "۵ زمین", callback_data: "get_song_Earth" },
                    { text: "۶ شطرنج", callback_data: "get_song_Chess" }
                ],[
                    { text: "۷ گل دلفریب", callback_data: "get_song_FascinatingFlower" },
                    { text: "۸ سپهر", callback_data: "get_song_Sepehr" }
                ],[
                    { text: "🔙 بازگشت", callback_data: "btn_main_Key" }
                ]
            ]
    };
    var ffKey = {
        inline_keyboard: [
            [
                { text: "۱ اسلحه", callback_data: "get_song_TheGun" },
                { text: "۲ دلم برای خودم تنگه", callback_data: "get_song_MissMyself" }
            ],[
                { text: "۳ یعنی چه", callback_data: "get_song_WhatDoesItMean" },
                { text: "۴ فرشته سرد", callback_data: "get_song_ColdAngel" }
            ],[
                { text: "۵ پستچی", callback_data: "get_song_Postman" },
                { text: "۶ و", callback_data: "get_song_And" }
            ],[
                { text: "۷ دانشمند", callback_data: "get_song_Scientist" },
                { text: "۸ پایان", callback_data: "get_song_Ending" }
            ],[
                { text: "🔙 بازگشت", callback_data: "btn_main_Key" }
            ]
        ]
    };
    var cwdKey = {
        inline_keyboard: [
            [
                { text: "۱ شیمی مصنوعی", callback_data: "get_song_ArtificialChemistry" },
                { text: "۲ ارتباط با کرها", callback_data: "get_song_CommunicationWithTheDeaf" }
            ],[
                { text: "۳ هارمونی زرد", callback_data: "get_song_YellowHarmony" },
                { text: "۴ دکمه انفجار", callback_data: "get_song_ButtonOfDoom" }
            ],[
                { text: "۵ اوقیانوس انزوا", callback_data: "get_song_UnderneathTheOcean" },
                { text: "۶ مردم", callback_data: "get_song_People" }
            ],[
                { text: "۷ روح آزاد", callback_data: "get_song_FreeSpirit" },
                { text: "۸ گناه طبیعت", callback_data: "get_song_NaturesGuilt" }
            ],[
                { text: "🔙 بازگشت", callback_data: "btn_main_Key" }
            ]
        ]
    };
    var vcKey = {
        inline_keyboard: [
            [
                { text: "۱ فرار آخر", callback_data: "get_song_FinalRun" },
                { text: "۲ اًٌ منفی", callback_data: "get_song_ONegative" }
            ],[
                { text: "۳ شنود", callback_data: "get_song_Eavesdrop" },
                { text: "۴ شعبده", callback_data: "get_song_Juggle" }
            ],[
                { text: "۵ زندگی بسته‌ای", callback_data: "get_song_PackedLife" },
                { text: "۶ مه تا وضوح", callback_data: "get_song_HazeToCelerity" }
            ],[
                { text: "۷ گورستان ایستاده", callback_data: "get_song_Verticalcemetry" },
                { text: "۸ کسی که دوست داشتم باشم", callback_data: "get_song_TheOneILovedToBe" }
            ],[
                { text: "۹ کجایی‌ام", callback_data: "get_song_WhereIamFrom" }
            ],
            [
                { text: "🔙 بازگشت", callback_data: "btn_main_Key" }
            ]
        ]
    };

    var singlesKey = {
        inline_keyboard: [
            [
                { text: "ربان سبز", callback_data: "get_song_GreenRobans" },
                { text: "رز صحرایی", callback_data: "get_song_DesertRose" }
            ],[
                { text: "رز مشکی", callback_data: "get_song_BlackRose" },
                { text: "زاناکس", callback_data: "get_song_Xanax" }
            ],[
                { text: "اتفاق خوب", callback_data: "get_song_GoodHappening" },
                { text: "اعتصاب", callback_data: "get_song_strike" }
            ],[
                { text: "ماشین انتقام", callback_data: "get_song_Revengemachine" },
                { text: "فواره‌های جیوه‌ای", callback_data: "get_song_MercurialFountains" }
            ],[
                { text: "هیج چیزی بهتر نمیشه", callback_data: "get_song_NothingWillget_song_Better" }
            ],[
                { text: "سیب", callback_data: "get_song_Sib" },
                { text: "هنوزم", callback_data: "get_song_Hanozam" },
                { text: "هنوزم", callback_data: "get_song_Hanozam" }
            ],
            
            [
                { text: "🔙 بازگشت", callback_data: "btn_main_Key" }
            ]
        ]
    };

    var videosKey = {
        inline_keyboard: [
            [
                { text: "کلیپ‌های رسمی", callback_data: "btn_official_video" }
            ],[
                { text: "کلیپ‌های غیررسمی هماهنگ شده", callback_data: "btn_unofficial_video" }
            ],[
                { text: "خوانش اشعار", callback_data: "btn_poems_video" }
            //],[
            //     { text: "سایر", callback_data: "btn_test" }
            ],[
                { text: "🔙 بازگشت", callback_data: "btn_main_Key" }
            ]
        ]
    };

    var official_video = {
        inline_keyboard: [
            [
                { text: "گورستان ایستاده HD", callback_data: "get_video_Verticalcemetry" },
                { text: "اسلحه HD", callback_data: "get_video_TheGun" }
            ],[
                { text: "فرشته مرگ HD", callback_data: "get_video_DeathAngle" },
                { text: "موسیقی زرد HD", callback_data: "get_video_YellowHarmony" }
            ],[
                { text: "شیمی مصنوعی HD", callback_data: "get_video_ArtificialChemistry" },
                { text: "در یاد SD", callback_data: "get_video_DarYad" }
            ],[
                { text: "🔙 بازگشت", callback_data: "btn_video" }
            ]
        ]
    };

var video = {
 //Official
 Verticalcemetry: `BAADBAADqgADhYeRUsdmxUTDM9g4Ag`,
 TheGun:`BAADBAADrQADhYeRUkh3ZuRkadARAg`,
 ArtificialChemistry: `BAADBAAD6gADkX2RUn4YTi_zSN6jAg`,
 DeathAngle:`BAADBAADtQADhYeRUvJg2uN5AercAg`,
 DarYad:`BAADBAADtwADhYeRUi7yIDHA4rIyAg`,
 YellowHarmony: `BAADBAADwwADhYeRUlFRcldynGopAg`,
 
 //UnOfficial
 People:`BAADBAADlwEAAsVlSwaqwD8YSrdg5QI`,
 And:`BAADBAADuAEAAsVlSwbgqg6jv9zhTQI`,
 ButtonOfDoom: `BAADBAAD7wADhYeRUtd1NzYVNKU6Ag`,
 FinalRun:`BAADBAAD8gADhYeRUtlqAAFvoF6MDwI`,
 Revengemachine:`BAADBAAD9AADhYeRUorwP_FjbgGWAg`,
 CommunicationWithTheDeaf:`BAADBAAD9QADhYeRUhG_Oa_b8W05Ag`,

 //other
 BackStage:`BAADBAADAQIAAsVlSwbM3eQo2RgVIQI`
}

    var unofficial_video = {
        inline_keyboard: [
            [
                { text: "مردم", callback_data: "get_video_People" },
                { text: "و", callback_data: "get_video_And" }
            ],[
                { text: "دکمه انفجار", callback_data: "get_video_ButtonOfDoom" },
                { text: "ماشین انتقام", callback_data: "get_video_YellowHarmony" }
            ],[
                { text: "فرار آخر", callback_data: "get_video_FinalRun" },
                { text: "ارتباط با کرها", callback_data: "get_video_CommunicationWithTheDeaf" }
            ],[
                { text: "🔙 بازگشت", callback_data: "btn_video" }
            ]
        ]
    };



    



var hadi = {
        DarYad: `در یاد
ساعتا وایسادن از حركت و بازی 
تو نمی‌خوای عشقِ خامِتو ببازی
رو تنت پر شده از زخم و غبارِ 
عشقی كه تشنه ی یک روز بهاره

من آسمون كشیدم رو سقفِ زردِ خونه 
تو مست و خسته اما از رقصِ اشک و گونه
تنم حریص و تشنه، بیتاب از بوی پاکِ
تنت كه غرقِ عطرِ رقصِ بارون رو خاکه

توی قلبم یه جهنم، پره آدمای زشته
یه غرورِ زرد و كهنه، مونده باقی از گذشته

بی تو تاریكیِ پر وهمِ خیالم 
شده گورستان و آهنگِ زوالم
تو چشات مونده هنوز، جای نگاهِ 
هرزه چشمایی كه نورشون سیاهه`,
      MaraMibini: `مرا می‌بینی
مرا می‌بینی و هر دَم، زیادَت می‌کنی دردم
تو را می‌بینم و میلم، زیادَت می‌شود هر دَم

به سامانم نمی‌پرسی، نمی‌دانم چه سَر داری
به درمانم نمی‌کوشی، نمی‌دانی مگر دردم؟

نه راه است این که بگذاری مرا بر خاک و بُگریزی
گذاری آر و بازم پُرس که تا خاکِ رَهَت گَردم

ندارم دستت از دامن، مگر در خاک و آن دَم هم
که بَر خاکم روان گردی، بگیرد دامنت گَردم
حافظ
`,
     Man: `من 

ه- هم آوازِ آهنگِ پایيز
آ- آلاله‌ها زرد، من شعرِ لبريز

د- دور از تو خون آلوده باور
ی- یاد شهرِ وحشت، یاد گلِ پرپر

پ- پا در زنجیر، قصه بی پایان
آ- آسمان از توست، سهمِ من زندان

ك- کهنه رويايي خالي از شورم
ز- زاده در آتش، زنده در گورم

آ- آلاله، برگرد از تبعید
د-ديوونه ی من، شب به كوچه تابيد

مردابِ غم آگينِ تن بود
قلبي كه تنها سرزمينِ من بود

نفرین به این عشق، رویای آبی
آلوده میلی، دیرینه خوابی

من آغازي بر شعرِ شیطان
خون سرخِ توست مُهرِ اين پيمان
`,
     Ashofte: `آشفته
آشفته‌ تر از صدای باران
رنجيده تر از سوزِ بيابان
فرياد بزن تا شبِ زشتت
شايد كه رسد شبی به پايان

چون نقش زدن بر تنِ سايه
بر آنچه گذشت لعن و كنايه
بر باد اگر رفتم و رفتی
مغرور بمان و بی گلايه
 
آن لحظه دلم پُر زِ یقین است
کین قافله از شرم غَمین است
"کان قافله دارِ بی نشانه
معصوم تر از خاکِ زمین است"

محرابِ تو بود رنگِ سپیدی
بُت خانه ی شهر پُر زِ پلیدی
"تا یک بُتِ پاک بر زمین بود
تو شکستنش به جان خریدی"

"دلداده بمان كه عشق پاک است
هر چند به سنگ كه جنسِ خاک است
هر چند به سنگ اشک حرام است
پايانِ شبم چه دردناک است"

(ابیاتی که در گیومه هستند جزو شعر بوده اند که از ترانه به ایجاب تنظیم حذف شده اند.)

`,
     Daghigheha : `دقيقه‌ها

دوباره دقيقه‌ها رو كُند و آهسته می بينم 
دوباره چشمِ خدا رو، رو خودم بسته می‌بينم 
 
تا دلم آروم بگيره سر به كوچه‌ها می‌ذارم 
رو به آدما می‌خندم، تو سياهیا می بارم 
 
توی يك جاده ی برفی پِیِ انتها می‌گردم 
توی اين رويای آبی هنوزم اسيرِ دردم 
 
آخه دنيا تو چشام رنگشو باخته 
آخه يك جنسِ غريبه آسمونِ منو ساخته 
 
بُرده رنگِ انتظارو بارونِ چشمای خسته‌م 
انگار آهنگی نداره بی تو اين قلبِ شكسته‌م 
 
عشقِ من جنسِ هوس نیست، رنگِ خاطراتِ تلخه 
قصه های پُر غباری که روشون چشمامو بستم 
 
از سپيده تا سپيده، آسمون ابری و تاره 
مثلِ بغضِ سينه‌ی من شوقِ باريدن نداره 
  
بوی بارون می‌ده حرفات، اشكِ چشمام بیقراره 
عشقِ من سوزِ زمستون، عشقِ تو شورِ بهاره
`,
     GoleParpar : `گلِ پرپر
گلِ پرپر شده تو بادِ زمستون 
ريشه كرده توی سرزمینِ ويرون 
پُره از گرد و غبار ساقه و برگش 
سهمِ اون از آسمون برف و تگرگش

ای اسیرِ سایه های سرد و تاریک
می رسه ناله ی شب از دور و نزدیک 
آبيِ روياتو به سياهی نفروش 
من نمی ذارم بشی اونجا فراموش
 
آه ای گلِ تشنه، من به آسمون رسيدم 
من نقشِ خدا رو روی ديوارا كشيدم
تا ريشه ی تو اسيره تو خاك 
آوای شبم مي‌مونه غمناك
 
هنوز از ریا سياهه آسمونِ شهرِ وحشت 
عمرِ عشقِ من تباهه از فریبِ زردِ قدرت 
سرده اما تَنِ ساقه ديگه احساسي نداره 
ديگه سبزي نمی‌گيره اگه آسمون بباره
`,
     SafheyeAkhar: `صفحه ی آخر
می‌گذشت از نیمه شب ساعت و من باز 
سر گرفتم عادت دیرم از آغاز

می‌چکیدم روی کاغذ می‌نوشتم
بی تو بارون، من مثل خاک خشک و زشتم

تا نوشتم گل پرپر شد زمستون 
دوباره دقیقه‌ها شد کند و آروم
 
فصلِ رویاهای آبی هم سر اومد
از تو ای گل اگه حتی خبر اومد

ناگزیر از یادِ تو باز پر گرفتم
بی رمق نفرین و ناله سر گرفتم

نفرین به این عشق، رویای آبی 
آلوده میلی، دیرینه خوابی 

زرد و زشت و کهنه بودش سقفِ خونه
من یه آسمون کشیدم عاشقونه

من فراموش و تو خاموشی و در یاد 
من همون آهِ هوس که دادی بر باد 

ساعتا وایسادن از حرکت و بازی 
تو نمی‌خوای عشق خامتو ببازی
 
مستِ بارونی و رقصِ اشک و گونه
هوسِ بوی تنت مثل جنونه

ای بهارِ رفته از عمرِ تباهم 
من یه واژه زیرِ یک خطِ سیاهم

من ناگزیر و خاموش از پا نشسته بر خاک 
قفس به خود تنیده از کینه های ناپاک`
	,
		Adamahani : `آدم آهن
فقط چند تا ترانه ست، كه می شنوی قبِل خواب
بیدار می شی می بینی، نخورد تكون آب از آب

یك ساله می نویسم، بمون یه لحظه خاموش
ببند چشاتو آروم، از هر چی هست فراموش

تو، تو شهرِ ذهنِ منی، ذهنِ یک آدم آهنی
ذهنی پر از صفر و یک و ارقامِ باور كردنی

من از سیاره ی جنون، پناه بردم به این زمین
یاد گرفتم از آدما، ببین، ولی نگو، همین

رو این زمین خاكی هم، حرف از بهشت، دوباره بود
سطلِ زباله ها پر از، نوشته های پاره بود

برای من بهشت یه جاست، زیرِ زمین، دور از همه
جایی كه قانونش منم، بی اعتراض، بی همهمه

واسه گریختن از زمین، فقط یک راهِ چاره بود
اون ورتر از دره ی مرگ، راهی به یک ستاره بود`,
		vasemanyavaseona: `واسه من یا واسه اونا
مادری بی قصد و چاره، بچه شو گذاشت سرِ راه
طفلِ بی زبونش داره می گه عقده هاشو با ماه

نیمی از زمینِ نا امن، از تو روشنه همه شب
گاهی صورتت هلاله، مثلِ پوزخندِ یک لب

ای كه روزا رو می خوابی، از تو مهتاب آسمونا
واسه كی داری می تابی؟ واسه من یا واسه اونا؟

توی هر قصه یكی هست، كه كتاب می شه به نامِش
یه عده میان و میرن، تا بمونه قهرمانش

واسه من یا واسه اونا، می نویسی قصه هاتو؟
كدوم از ما اگه باشیم، می خرن نوشته هاتو؟

می گه حرفاشو با قلبش، پیرِ روزگار چشیده
قلبی كه یه عمره باطل، واسه این و اون تپیده

ای كه می تَپی بی‌وقفه، توی كالبدِ تَنِ من
ای كه می كوبی به ظرفِ سینه‌ی از آهنِ من

قلبكم می گذره از تو، همه رگ هام، همه خونا
واسه كی می تَپی پس تو؟ واسه من یا واسه اونا؟
`,
		ShesmyMom : `She is my mom
Is it hard finding me?
On this naked branch of tree
I'm a leaf, full of pain
under this rush of the rain

این بس نیست که تنها رو این شاخه بمونم؟
بزن رگبار و بکن تن از ساقه و خونه‌م!

She's my mom, so sick and tired
She's burning in cancer's fire
My Mom!
Don't you feel like falling down?
Don't you feel like being alone?

برگکم بمون رو شاخه
هستی درختی آخه
واسه تو درد و تگرگه
واسه من افول و مرگه

Is it hard finding me?
on this naked branch of tree
I'm a leaf, full of pain
under this rush of the rain


She is my mom
Is it hard finding me?
On this naked branch of tree
I'm a leaf, full of pain
under this rush of the rain

این بس نیست که تنها رو این شاخه بمونم؟
بزن رگبار و بکن تن از ساقه و خونه‌م!

She's my mom, so sick and tired
She's burning in cancer's fire
My Mom!
Don't you feel like falling down?
Don't you feel like being alone?

برگکم بمون رو شاخه
هستی درختی آخه
واسه تو درد و تگرگه
واسه من افول


پاییز ای فصل غم
نخواه که دل آزرده شم
بترس از نفریـنم
نشه این برگ از شاخه کم

She's my mom, so sick and tired
She's burning in cancer's fire
My Mom!
Don't you feel like falling down?
Don't you feel like being alone?`,
		Ghanoon: `قانون

چرا اون پایین یه ایل منتظرن تا بپرم!؟
تو به اوناها بگو که من فقط یک نفرم!
اینکه پرواز نمی دونم دیگه شاهد نمی خواد!
غم که بوی خون گرفت هیچ کسی رو خوش نمیاد

اگه لحظه ها دارن از من مثل تو می گذرن 
اگه سکه ها دارن نوشته هامو می خرن
ای خدا من زنده ام در نیمه ی خاموشِ تو
با من از پاکی نگو من غرقه ام در نوشِ تو

من یه جمله م از یه قانون که تو هم شامل اونی
واژه های من نباشن تو نمی تونی بمونی

پس بگیر هر چی که دادی، پس می گیرم هر چی گفتم
من یه برگِ خشکم اما با خودِ درخت می افتم 

بیش از این تکرارِ من فریادِ سنگ از آهنه 
سنگ می دونه معنیِ دردو ولی نمی شکنه
`,
		Afaterisheh : `آفت ریشه

نبضِ من می زنه لاله
بسه بی تابی و ناله
می پرم بی وزن و آروم
این نه مرگه، نه زواله

روی شونه های من باله
شبنمِ چشام زلاله
من صدات می زنم لاله
اون می گه همش خیاله
 
اون هم آغازه هم فرجام
عاری از جسم و تنه اون
من نه تصمیمم نه انجام
آره برتر از منه اون

اون همون بنده وُ زنجیر
اون همون زندونِ شیشه‌س
اون همون مرگه وُ واگیر
اون همون آفتِ ریشه‌س

هرچی نور و شیء وُ وهمه
هر چی می گمو می فهمه
نه غروبه، نه سپیده
بوی دنیا رو نمی ده

خالی از هر شور و حاله
هر یه لحظه قدِ ساله
من می خوام برگردم اما
اون میگه دیگه محاله

بس كن برو دیگه، گفتم تو رو دیگه
بس كن برو دیگه، گفتم تو رو دیگه...
`,
		Zendegizirezamin : `زندگی زیر زمین


تا بپرم، پَر ندارم
شبم که آخر ندارم
تا بمونم، تاب ندارم
خسته م ولی خواب ندارم

بوی شیشه ی تَر میاد
صدای خاکستر میاد
برای من نفس بکش
هنوز این از تو بر میاد

گم شده آروم و راحت
واسه من زنجیر و بندی
بگذر از من مثلِ ساعت
که گذشت بیست سال و اندی

تو می خوای روی یه کاغذ
بنویسی خسته ای از
زندگی با یک دلِ تنگ
عاشقی کردن با یک سنگ

زندگی زیرِ زمین، گاه
طاقتم نیست بیش از این آه
پشتِ این عینکِ تیره
هردو زشتن خورشید و ماه

زندگی زیرِ ترانه
گفته های بی گَمانه
آنچه بر من رفته شعله
می کِشد از تو زبانه

تیکه تیکه شکسته هام
ببین می ریزن زیرِ پام
نگو خدا دوسَم داره
من دیگه هیچی نمی خوام

منو تو آغوشت نگیر
من دیگه آروم نمی شم
نگو خدا دوسَم داره
من دیگه هیچی نمی گم...
`,
		Zendaneshishei: `زندان شیشه‌ای

آه اگر گریه كنم، می شكنی از غم
تار و پودِ باورت، می پاشه از هم
وای اگر ناله كنم می سوزه خونه
جای آهم روی دیوارا می مونه

من فقط یك نفرم قَدِ یه دنیا
 غم شده سهمِ من از زشتی و زیبا

توی یك زندون از شیشه
شبا می خشكونم ریشه
بباره سنگ از آسمون
می مونه اشكِ من پنهون

سینه پُر خون شده از یك رازِ وحشی
دیده آزرده ام از هر نور و نقشی
هر نَفَس كه می گذره از قلبِ سینه
بوی غم می گیره و آهنگِ كینه
`,
		Extacy: `اکستازی
		...
		`
	,
		TheresNothing: `چیزی نیست

چیزی نیست که بخوام بگم
جایی نیست که بخوام برم
هیچکی نیست که بخوام بیاد
برای رفتن حاضرم...

چیزی نیست که بخوام لمس کنم
 طعمی نیست که بخوام بچشم
بویی نیست که بخوام حس کنم 
رنجی نیست که بخوام بکشم

جایی نیست که بخوام بمونم
مرزی نیست که ازش بگذرم
راهی نیست که نرفته باشم
رنگی نیست که ندیده باشم

میلی نیست تا برنده باشم
طوری نیست که نبوده باشم
حرفی نیست که بخوام بشنوم
رازی نیست که بخوام بدونم

چیزی نیست که بهش فکر کنم
کافیه دیگه نمی خوام بمونم

شوقی نیست واسه رسیدن
چیزی نیست برای داشتن
حسی نیست برای احساس
نیست آرزویی برای داشتن

نیست چیزی که به دست بیارم
چیزی نیست که بخوام ببازم
هیچی نیست که بخوام لِه کنم
چیزی نیست که از نو بسازم

نیست طاقتی به این اسیری
صبری نیست از جنس پیری
نیست نقطه ای برای آغاز
نیست جایی که تمومی بگیری

یادی نیست،
            سهمی نیست،
                     	میلی نیست،
                                     چیزی نیست.

.`,
		Dark: `تاریک

تاریک، اما آرام، گاهی صدای دوری
تاریک، اما نه ناامن، گاهی سوسوی نوری

تاریک، اما معلوم، گاهی حقیقتی ژرف
تاریک، اما آزاد، بی ملیت مثل برف

تاریک، اما نه برزخ، خوشبخت مثل بهشت
تاریک، اما زیبا، نه مثل روشنی زشت

تاریک، اما تاریک...

تاریک، اما نزدیک، تا هر کجای هستی
تاریک، اما نه تنها، حس می کنم که هستی

تاریک، اما پُر شوق، مثل بوسه ای بی تاب
تاریک، اما زلال، مثل چشمه ی برفاب
 
تاریک، اما اهلی، مثل بوی نمِ خاک
تاریک، اما با هم، یک رقصِ تن به تن، پاک

تاریک، مثل هیچ چیز، بی همتا مثل مرگ
تاریک، اما افسوس، از افتادن هر برگ

تاریک، اما افسوس، تو نیستی در بَرَم
تاریک، اما افسوس، از این بستِر تَرَم

تاریک، اما تاریک...
`,
		Book: `کتاب
تمومِ حرفایی که نگفتی
می خوان که زودتر از پا بیفتی
همه لحظه ها که ساکت نِشَستی
منتظرن تا ببینن شکستی

اون همه کتاب، کنجِ اون خونه
پُره حرفای مفت و ارزونه
این همه جواب واسه یک سوال
کی از دلِ تنگِ تو می دونه؟

چشاتو باز کن، اینجا دنیاست
بهشت یه جایی دور از اینجاست
جهان سراسر ظلم و سهمه
انسان هر دَم مشمولِ رحمه

این همه لباس، این همه نقاب
تو هیچی نیستی به جز گِل و آب
اگر یه عُمره که تو بیداری
یه لحظه فقط کنارم بخواب

کتابِ سفید، کتابِ سیاه
چی می دونن از جنگِ مِه و ماه؟

خوش اومدی به تمدن پوچ
تمدن بومی های زود کوچ

خوش اومدی به تمدنِ مرگ
تمدنِ ساقه های بی برگ
 تمدنِ ترس، تمدنِ شَر
کهنه ترین اختراعِ بشر

خوش اومدی نوزادِ کتابی 
بیدار شو رَفیق، یه عُمره خوابی

وقتی قلبِ من و تو شب
روی نیمکتا می خوابن
وقتی ناگفته ها هر سال
شرطِ قیمتِ کتابن

وقتی با یک بغض پُر از حرف 
شب، کنارِ شب می خوابی
داره دیر می شه لعنتی
تو خودت یک جین کتابی
`,
		Redline: `خط قرمز

با چشمای محکم بسته، رهام کردی توی این شهر
یک عمر عادتم دادی، به نوشیدنِ این زهر

پا فراتر گذاشتم از ممنوعِ خطِ قرمزِ تو
طمع نبستم هرگز اما، به بهشتِ هرگِز تو

تو خشم گرفتی بر من، من طعمِ سخت چشیدم
تو جور نوشتی و من، مردانه جور کشیدم

چشم برنمی دارم از هر چی که گفتی زشته
پامو نذاشتم اونجا که می گفتی بهشته

اینجا سرزمینی است از رنگِ آبى و هوای خنک و رودخانه ای از نورِ تابناک در دو طرفِ خیابان

زیبایی اش در جريان...

کودکان با گونه های سرخ به خیابان می ریختند و رقص کنان گلبرگ هایی را زیر پای می پراکندند و دسته گل به گردن

پیکرهای آبى...

تو قصه می نوشتی و من، هر قصه رو صد بار می خوندم
تو چشمامو می بستی، من تو اون رویاها می موندم

برگه های آخرِ کتابو، می کندی و من می پرسیدم
می گفتی: مهم نبودن، آخرشو تو چشات می دیدم

با چشمای محکم بسته، رهام کردی توی این شهر
یک عمر عادتم دادی، به نوشیدنِ این زهر

تو یادم دادی که تو بودن، هرگز پایانی نداری
این خط تا وقتی قرمزه که پاتو اون وَرِش نذاری`,
		MissYourFace : `دلم برای صورتت تنگ شده

دلم برای صورتت تنگ شده بوی نم میاد
هر طور زندگی می کنم بازم یه چیزی کم میاد
اگر به جای خاکِ خشک، روت آبِ تر ریخته بودن
می شد ببینی که چطور منو به هم ریخته بودن

دلم واسه بوی تنت تنگ شده، چشماتو ببند
هر جای آسمون هستی، به من فکر کن، به من بخند
بمون توی رویای من، یاد به فراموشی نده
من به شوقِ تو می خوابم، دنیامو خاموشی نده

من ناگزیر از بودنم، در شهرِ مردم واره‌ها
بر خاکِ تو زانو زدم، در خیلِ کاغذ پاره‌ها
آرامِ جانم طعمه شد،  بَر خوانِ عاشق خواره‌ها
آخر جنونم می کند، آواره از آواره‌ها
`,
		GlassyGuard : `پیله‌های شیشه‌ای

تار و پود ریسیده ای از پیله های شیشه ای
حبسِ حجمِ پیله ای دور از حیاتِ ریشه ای

من نفس کشیدم و آسون تو رو بردم زِ یاد
زندگی کن رو تنِ آشفته و نا امنِ باد

طعمِ شیشه، لبِ خونی، زهرِ تکرار
بوسه ها ازپشتِ شیشه، آهِ غمبار

با دروغِ کهنه تا کِی بوسه بازی؟
دل بکن از سهلیِ این راهِ هموار!

تار و پود ریسیده ای از پیله های شیشه ای
مسخِ حجمِ پیله ای دور از حیاتِ ریشه ای

من به تصویرِ تو از پشتِ شیشه خیره و مست
بی توجه به به جز صورت ِتو هرچی که هست 

آن قدر بوسیدمت در رویا از سوی دور
خانه ی تاریک رویا روشن است از بوی نور

از بهشت زیِر زمین تا زندگیِ گیشه ای
دردِ مشترک تویی، تو پیله های شیشه ای
 
تو تنها شعرِ من هستی که از زشتی تهی هستی
تو تنها قطره ای هستی که دریایی

من آن بادم که می تازم، به هر سویی به هر سویی
تو تنها قطره ای هستی ، که می نوشم
`,
		OrdinaryPerson : `آدم معمولی
می خوای چی یادِ من بدی، مگر تجربه پولیه؟
کجا تجربه می فروشن، کجای این کار اصولیه؟

یه طور حرف می زنی انگار زندگی چارتا قانونه 
هر کی کلاسِ تو رو بیاد زندگی واسه ش آسونه

آدمِ معمولی بس کن تو هیچی بیشتر نمی دونی
هر چی تو اون کلاسا می گی، جز تو کتابا نمی خونی

آدمِ معمولی بس کن با نگاهت نزن طعنه
نه من عروسکِ قصه م، نه این فیلمه نه این صحنه

اگر ازت بپرسن که چرا جات اون بالاها نیست؟
می گی انتخاب خودمه، بهتر از اینجا هیچ جا نیست

اسم خودتو گذاشتی مَستر قرعه به نامت اینطوری افتاد
اگر زندگی درس آدماس تو چه کاره ای؟ بی خیال استاد

آدم معمولی صبر کن، شروع نکن به درس دادن
یه بار دیگه اونارو بخون، چند جمله از قلم افتادن

آدم معمولی بس کن با نگاهت نزن طعنه
نه من عروسک قصه م، نه این فیلمه نه این صحنه`,
		Doctor: `دکتر

دکتر دیشب دوباره، مریضِ خوبی شدم 
همه قرصا رو خوردم، یک آدم چوبی شدم

دکتر چرا عروسک، غمگین نمی شه گاهی؟
دکتر دارویی بده، دکتر بگو یه راهی 

دکتر دیشب تب کردم، انگار چیزایی گفتم
صبح یکی ازم پرسید، چی اومد سَرِ جفتم؟

فکر می‌کنم از کشتی به آب افتاده باشم
حس می کنم رو تنِ نهنگ ایستاده باشم

فکر می کنم به بویِ دریا خو کرده باشم
تو شکمِ نهنگ، مرگ، آرزو کرده باشم

فکر می کنم چیزی رو از یاد برده باشم
حس می کنم یه جایی، یه روزی مرده باشم

دکتر منو از اینجا ببر
بیا این پول زندگیمو بخر
دکتر ماهیا نمیدونن، 
من ماهی نیستم نمی تونم

دکتر این نسخه ای که دادیه
دکتر نگو همه چیز عادیه

دکتر بگو چه م شده، چرا ذهنم خالیه؟
هیچ احساسی ندارم، نگو اینکه عالیه!
`
	,
		BloodyMe : `من لعنتی

منِ لعنتی و این شهر که همو هیچ نمی فهمیم
مثلِ پشت و روی سکه واسه هم مفهومِ وهمیم

من به شکلِ زشتِ بودن، تو به رسمِ بدِ انکار
هر دو مشغول تحمل، من به اجبار تو به اصرار

من و چشم ترِ نیما، من و این لباسِ ژنده
زیرِ آوارِ نگاهِ مردم شهر، زنده زنده

من لعنتی که هرگز، حسِ بهتری نشناختم
 توی کانون توجه، از خودم بازنده ساختم

منِ منفوری که هر جا، به همه حسِ بد دادم
 جبر خلقتم همینه، من یه اشتباهِ ساده م

من و زندانبانِ گریه، من و حسرت های پروین
 مرگِ من روزی فرا خواهد رسید، روزی پس از این

منِ لعنتی همینم، جوهرِ تلخ روی دیوار 
من رسالتم همینه، واسه این شهر، شعرِ آزار

من و افلاطونِ بی رحم، من و سستی های بیزار 
شهر و آرامشِ مزمن، من و کوشش های بیمار 

منِ لعنتی نمی خوام، اتفاقِ ساده باشم
نه به قیمتِ خوب بودن به نبود افتاده باشم

`,
		WhatAboutMe : `پس من چی؟


می دونم وقتِ تو رسیده، پس وقتِ من چی میشه؟
می دونم پاهای تو خسته ن، پاهای من چی میشه؟

می فهمم چشمات غم دارن، چشمای من چی میشه؟
می بینم غمگینی، اما غم های من چی میشه؟

می دونم خسته ای اما خستگی من چی میشه؟
باید زندگی کنی اما زندگی من چی میشه؟

حرکت نکن، اینجا درست همونجاست که باید باشی
بغض نکن، درست همون لحظه باید از جا پاشی

نفس نکش، همین الان همه از تو هوا می خوان
پلک نزن، اینجا همه فقط از تو نگاه می خوان

تو انتظار کشیدی، پس صبرِ من چی میشه؟
می فهمم مجبوری اما پس جبرِ من چی میشه؟

می دونم که تو همینی، پس خودِ من چی میشه؟
تکلیفِ اون خودِ تویی که شده من، چی میشه؟

می دونم آرزوت این بود، آرزوی من چی میشه؟
می فهمم حقِ تو همینه، پس سهمِ من چی میشه؟

پس عمرِ من چی میشه؟ می دونم واسه تو زوده
پس سهمِ من چی میشه؟ پس سهمِ من چی میشه؟

می بینم راهِ تو جدا شد، پس راهِ من چی میشه؟
مهتابِ شبت برگشت، پس ماهِ من چی میشه؟

می دونم فصل تو رسیده، پس فصلِ من چی می شه؟
می فهمم سبزِ من گذشته، پس نسل من چی میشه؟
`,
	Deathangel : `فرشته مرگ

بیا آروم منو از گودال بالای این پیکر بکش بیرون، 
ببر بالا
ببر جایی که هیچ چیزی نمی مونه، 
برای حتی یه لحظه 
ببر جایی
به دنیایی که هر چیزی یه تصویره
یه رویا یا...

بیا آروم، طوری که هیچکی نفهمه
وسوسه م کن
با نگاهی که بی اندازه بی رحمه
که بی اندازه بی رحمه...

بیا نزدیک، طوری که هیچکی نبینه
دچارم کن 
به احساسی که بی اندازه غمگینه
که بی اندازه غمگینه...

 فقط فرضه، نه دنیایی که ساعت ها شدن حاکم
 و تازه باتری هم می خوان!
همین دیروز کوانتوم گفت 
که ساعت ها ما رو می پان،
و تا تو نمی بینیشون،
به حرکت هم در نمیان،
فقط یک بیننده می خوان
`,
		YouDidntHaveTo : `مجبور نبودی

تو مثلِ من نبودی، کارای سخت نکردی
جاهای دور نرفتی، چیزای بد ندیدی 

تَنِت بارون نخورده، قهرمانِت نمرده 
شبونه بدمستیِ باد، هستیتو نبرده
 
معشوقه ی خیالی به آغوش نکشیدی 
با چشمِ بسته هر شب خیالو نبوسیدی

خون و اشک و شرابو، تو با هم نچشیدی

لازم نشد برگردی، لازم نبود برگردی
که ثابت کنی مَردی 
لازم نشد بمونی، لازم نبود بمونی
ثابت کنی می تونی 
لازم نشد بمیری، تا انتقام بگیری

تو می کُشی هر شب منو توی ذهنت به حالِ بد 
تصویرِ من تو رویاهات تبدیل شده به یک جسد 

تو می کُشیم، فقط چون من هم مثلِ تو یه آدمم 
به میوه ی ممنوعه ی درختِ باغِت دست زدم

تو مثلِ من نبودی، کارای سخت نکردی
جاهای دور نرفتی، چیزای بد ندیدی 

تَنِت بارون نخورده، قهرمانت نمرده 
شبونه بدمستیِ باد هستیتو نبرده
 
معشوقه ی خیالی به آغوش نکشیدی 
با چشمِ بسته هر شب خیالو نبوسیدی

خون و اشک و شرابو، تو با هم نچشیدی
چندتا قرص با یه بغضو، تو با هم نبلعیدی
 
زنده زنده تو گورِ باورهات نپوسیدی
`,
		Earth: `زمین

آه زمین، حرف بزن
آه زمین، کلافه ام
بگو چرا رو حجمِ تو
من یه جِرمِ اضافه ام؟

زمین، ای سربازِ خورشید
ای سیاره ی رو به سردی
با این نظمِ کسل کننده
تو تا کِی می خوای بگردی؟
زمین با من حرف بزن
زمین با من حرف بزن

و اونا گریه می کنن
و من حتی نمی دونم
که چی تا این حد دردناکه
و چرا من نمی تونم؟

و از افلاطون می پرسم
که چرا زندگی سخته؟
و افلاطون جواب میده
من اون قدرا نمی مونم
من اون قدرا نمی مونم

سیب دیدی مست شدی
نیست بودی، هست شدی
اقامتگاهِ مرد شدی
میزبانِ جنگِ سرد شدی

میوه بودی، مادر شدی
خشک بودی، تَر شدی
اقامتگاهِ زن شدی
میزبانِ جنگِ تَن شدی

سیب دیدی مست شدی
نیست بودی، هست شدی
اقامتگاهِ مرد شدی
میدونِ جنگِ سرد شدی

میوه بودی مادر شدی
خشک بودی، تَر شدی
اقامتگاهِ زن شدی
میزبانِ جنگِ تَن شدی

آه زمین، بعد از این
جسمِ منو پایین نکِش
از تکرارِ نجاتِ تلخ
از جذبِ من دست بِکِش

زمین ای سنگپاره ی مطرود
ای آواره ی آواره آلون
با من از اون راز بگو
پیش از این که بشیم نابود
زمین با من حرف بزن
زمین با من حرف…
`,
		Chess: `شطرنج
سیزده ساله که بودم کسی رو نمی شناختم
که تو بازیِ شطرنج، شاید بهش می باختم

فکر می کردم نابغه م، حس می کردم یه مَردَم
هر بار که با نقشه ای، کسی رو مات می کردم

شنیده بودم شطرنج رو کامپیوترها هست
با خودم گفتم چرا حریفو بدم از دست؟

وقتی که اولین بار به یک رایانه باختم
مهره ها رو برای همیشه دور انداختم

حتی اگر اون دستگاه، بازی رو به من می باخت
مدتی بعد یک شرکت، نسلِ برتری می ساخت

یاد گرفتم همیشه موجودی باهوش تر هست
حتی وقتی از قدرت، بی اندازه شدی مست

درست وقتی تو بازی، یه جای خوب نشستی
یه بازی بزرگتر هست که تو جزوش هستی

اینجا جایی برای از خود راضی شدن نیست
بازی کردن جز دامی واسه بازی شدن نیست`,
		FascinatingFlower : `گل دلفریب
گلِ دلفریبِ سرخِ باغ ِمن، پس بوی گلبرگ تو کو
عشق من چیزی بگو، قلبی بسوز، چشم به منِ خسته بدوز

تا نسیمِ سردِ شب از ساقه ی تو می وزه به صورتم
من هنوز دیوونه تم، بی من نمیر، عشق من پاییز نگیر

گاهی از دوری من، آهی سر کن گل من
گاهی بیدار بمون تا صبح با خیال من

گاهی از دوری من، دلتنگی کن مث من
با عطر خوش نفست، شعری بگو واسه من

گل دل فریب سرخ باغ من، پس بوی گلبرگ تو کو
عشق من چیزی بگو، قلبی بسوز، چشم به من خسته بدوز

شبنمِ زلالِ چشمه ی چِشِت، گونه های پر خواهشت
واسه من آرامشه، بارون نبار، عشقِ من تنهام نذار

کودکی کردیم من و تو، توی باغ کهنه و پیر
تازگی نداره این فصل، فصلِ پاییزِ فراگیر

نه درخت، نه برگ، نه ریشه، شیفته ی سنگ و همیشه
گل دل فریب من تاب، نه به قانونِ همیشه

گل دل فریب سرخ باغ من، پس بوی گلبرگ تو کو
عشق من چیزی بگو، قلبی بسوز، چشم به من خسته بدوز

به جنون کشیده قحطیِ نفس، از رنجِِ موندن تو قفس
زنگِ دلفریبِ خنده‌های تو، میوه ی رسیده نو

گاهی از دوری من، آهی سر کن گل من
گاهی بیدار بمون تا صبح با خیال من

گاهی از دوری من، دلتنگی کن مثل من
با عطر خوش نفست، شعری بگو واسه من

دل هیچ کسی برای باغ ما هرگز نمی سوزه گلم
بندِ تنهاییِ من بی بوی تو هرگز نمی پوسه گلم

تا نسیمِ سردِ شب از ساقه ی تو می وزه به صورتم
من هنوز دیوونه تم، بی من نمیر، عشق من پاییز نگیر`,
		Sepehr: `سپهر
نُهِ شب توی یک پارک، نزدیکِ نیمه ی مهر
یکی صدام می زنه، یه دوست به اسمِ سپهر

بِم گفت آهای خواننده، تو زیادی تند می گی
حرفای پیچیده رو، داری خیلی رُند می گی

تو کِی موسیقی خوندی، تو از شعر چی می دونی؟
تو رشته ت این نبوده، به عِلمِت مدیونی

همون شب ساعتِ یک، به حرفاش فکر می کردم
رو گردشگرِ گوگل، اسممو چک می کردم

یه سایت ازم نوشته، فلانی سرش گرمه
به کارایی که می گن واسه اون جای شرمه

نوشتم تو اون وبلاگ، از قولِ یک غریبه
ممنون از اخبارتون، فقط یه چیز عجیبه

ای حامیانِ هنر، ای وِب نویس ِخلاق
فلانی یه خواننده ست یا یه الگوی اخلاق؟

تشدیدِ شایعاتو بهش می گن زرنگی
تا امروز فکر می کردم مروج فرهنگی

پیش از نوشتن از یک خواننده یا یه شاعر
دستِ کم یه شعرشو بفهم جنابِ ناشر

هیچکی تشخیص نمیده، نابغه یا کلاشی
شهرت یه اشتراکه، چه حرفه ای، چه ناشی

برای تو مهم نیست که به چی مشهور باشی
شهرت فقط همینه که وِردِ زبونا شی

شعور لباس بپوشی، احمق باشی یواشی
طلا تظاهر کنی، مس از درون بپاشی

دیگه خواننده نیستم، سپهر تو بد نمی گی
دیگه شرمنده نیستم، تو کفشم نیست هیچ ریگی

خداحافظ موسیقی، خداحافظ ترانه
خداحافظ کیمیا، رویای مس گَرانه

وقتی همه مس می خوان، مس عنصرِ برتره
طلا هم زنگ می زنه، این قانونِ باوره

کیمیا فاسد می شه، کیمیاگر پیر می شه
پرنده ها می خزن، ماده شیر اسیر می شه

از خودم این سوالو پرسیدم تا صبح اون شب
حتی بعد از اون گاهی می پرسمش زیرِ لب

تو هم یه بار مثلِ من، یه روز از روزای مهر
یکی از سوالا رو بپرس از خودت، سپهر `
	,
		TheGun : `اسلحه
مثلِ سگ تو رختخواب، تمرینِ مردن می کنی
مثلِ هابیل سعی بر از یاد بردن می کنی

مجرمِ سِقطِ شعور، بیچاره ای از کمترین
سوزن از تو نعشه تر، خونِت از سَم، سَم ترین

فرقِ روز افزونِ تَن ها 
وحشِ پُر فحشای من ها
مردِ بی اقبالِ پیروز
حُزنِ بی مقدارِ زن ها

مثلِ سگ در انتظاری
تا وفاداری کنی 
مثلِ قابیل بی قراری 
تا عزاداری کنی 

یادت نره اسلحه
هنوز تو دستِ منه
هرچند هم آرومم
اما نبضم می زنه

باید ورق برگرده
من همین جام عزیزم
من مدیونِ شانس نیستم
از دور، شعر نمی ریزم

چقدر رنج پدرخوانده
به تو بدهکارم من؟
و چند روز به آن مانده 
که چشم به هم ذارم من؟

و تا کی قصد داری تو
پدر به این آزار ها؟
و چند بار بگویم من
خسته م از این چند بارها؟

من بارها هستیمو از دست باد گرفتم 
از بهترین معلم سکوتو یاد گرفتم

سخت میشه گفت اسلحه وسیله ی شکاره
هر حیوونی رو دیدم اسلحه رو دوست داره `,
		MissMyself : `دلم برای خودم تنگه
نیمی از یک مترسک با نیمی از یک بدن 
با هم پیوند خوردن تا پیکر من شدن

کلاغ ها هر روز از نیمی از من می ترسن
و لاشخور ها شب روی نیم دیگه می رقصن

سال هاست من حامی گندم های تو بودم
به زندگی برای تو خو کرده وجودم

تو از کلبه ی اون دور هر صبح با لبخندی
و پیش از خواب هر شب پنجره را می بندی

و من با شیاطین تا صبح می جنگیدم
و هر بار پیش از صبح بغضم را می بلعیدم

و تو درست به کسی زندگیتو مدیونی
که مدت هاست از اون هیچ چیزی نمی دونی 

سال هاست زندانی آزادی تو هستم
قهرمان و قربانی، از این دو واژه خسته م

سال هاست پوست گرمی رو با شوق نبوسیدم
مدت هاست که توی آب  صورتم رو ندیدم

دلم برای تو برای تو از نزدیک
تنگه برای نفس، تو یه گوشه ی تاریک

دلم برای اشک، دلم برای خواب
دلم برای سیب، دلم برای آب
دلم برای زن، دلم برای تن
دلم برای من، دلم برای من

دلم بیش از هر چیزی برای خودم تنگه
و من برای خودم ، دلم چقدر تنگه

و من سال هاست برای خودم، دلم تنگه
و من چقدر برای خودم دلم تنگه `,
		WhatDoesItMean : `یعنی چه؟
ناگهان پرده بَر انداخته‌ای، یعنی چه؟
مست از خانه بُرون تاخته‌ای، یعنی چه؟

زلف در دستِ صبا، گوش به فرمانِ رقیب
این چنین با همه در ساخته‌ای، یعنی چه؟

شاهِ خوبانی و منظورِ گدایان شده‌ای
قدرِ این مرتبه نشناخته‌ای، یعنی چه؟

نه سرِ زلف، خود اول تو به دستم دادی
بازم از پای در انداخته‌ای، یعنی چه؟

سخنت رمزِ دهان گفت و کمر سِرِّ میان
و از میان تیغ به ما آخته‌ای، یعنی چه؟

هر کس از مهره ی مهرِ تو به نقشی مشغول
عاقبت با همه کج باخته‌ای، یعنی چه؟

حافظا در دل تنگت چو فرود آید یار 
خانه از غیر نپرداخته ای، یعنی چه...

"حافظ" `,
		ColdAngel : `فرشته ی سرد
عطرِ گرم، پوستِ نرم، لبِ سرخ، لحنِ سرد
حسِ شرم، طعمِ یخ منو دیوونه می کرد
ذهن لبریز از تصویر
یه جمله تو چند نفس
نبض اندوه لعنتی
نمی گفتی چرا پس؟

درست کنار قلبم
انگار یخ زده بودی
کمک نمی کرد به من
گرمای هیچ وجودی 
به من سرما می دادی
تا زنده بمونم
تو رخنه کرده بودی
به اعماقِ درونم

اگرچه باور کردم
تو دیگه زنده نیستی
تو هر نگاهِ سردی
مقابلم می ایستی
فرشته ی سردِ من
برای من حرف بزن
برای صورتِ من
نوازشِ گرم به تن `,
		Postman: `پستچی
من فقط یک پستچی بودم و نه بیشتر
تو فقط یک نامه بودی و نه کمتر

انتخاب ِمن فقط رسوندنت بود
مال من نبودی، پس رسوندمت زود

تو همراه من بودی، نه مال من
تو اجبارِ من بودی نه بال من

گرچه باید بسته می موند پاکتِ تو
منو ببخش که بردم راحتت رو

غمی بزرگتر از این برای منِ مست
که مال من نباشی در حالی که دلت هست

تو ببخش که مست شدم از بوی جوهر
من یه کاغذ خوار ساده م نه بیشتر

به گناه میل دارم و صدها برگه
واسه این پستچی خوب وسوسه مرگه

گرچه من پستچی خوبی نموندم
تو هستی چون من تو رو سالم رسوندم

این چقدر سخته که یک پستچی باشی
و خودت صاحب نامه ای نباشی `,
		And: ` وَ... 

تو خیلی باهوشی
همه چیز می دونی
آب زیرت نمی ره
تو جا نمی مونی

هرگز نمی ترسی
رفتارت سنگینه
غافلگیر نمی شی
نگاهات خشمگینه

تو خیلی خونسردی
تو جمع ها می خندی
هر چیزی رو قبلا
تو پیش بینی کردی

وَ... وَ... وَ... و البته تو واقعیتی
اما تو فقط قسمتی از حقیقتی
وَ... وَ... وَ... و تو می دونی همه درس
و از چیزایی که نمی دونی بترس

تو خیلی مرموزی
سخت می شه فهمیدت
و خیلی دور از دسترس 
و کمتر می شه دیدِت

و تو خیلی ویژه ای
و اشتباه نداری
و همه چیز در تو هست 
و تو شانس نمیاری

وَ... وَ... وَ... و البته تو واقعیتی
اما تو فقط قسمتی از حقیقتی
وَ... وَ... وَ... و تو می دونی همه درس
و از چیزایی که نمی دونی بترس `,
	
	Scientist: `دانشمند
افلاطون كه به نوعی پدر فلسفه و اخلاق بود، مطلق گرایی جاری در فلسفه را به اخلاقیات نیز تعمیم داد؛ چنانچه در وصیت نامه ی خود الگوهای مشخصی برای رفتار تعیین كرد و پس از او مرید و شاگرد او ارسطو به اشاعه و تحلیلِ اینچنینیِ اخلاق به طور بی رحمانه ای ادامه می داد؛ تا جایی كه تا پیش از رنسانس جنایات و ظلم های بی اندازه ای به این استنادات صورت گرفت و كلیسا در راس آن قرار داشت.
امروز پس از گذشت قرن ها هنوز افلاطون ها خوب و بد را مطلق می كنند و هنوز گالیله ها در كلیساها ناگزیر از كتمان خود هستند.
خوانده ام كه هر رویدادی در دنیای فیزیك قبلا تصویری در دنیای ذهن بوده؛ 
خوب كه فكر كنیم خواهیم دید كه خیلی از كارهای زشتی را كه هرگز انجام ندادیم حداقل یك بار به آن فكر كردیم و در دنیای ذهن آن ها را دیده ایم؛ یك سوال می پرسم آیا گناهِ دیدنِ این صحنه ها كمتر از انجام دادن آن هاست؟ برای مثال اگر همین الان مجازات قضائی و عذاب وجدان و اخلاقیات و همچنین اعتقادات را از دنیا حذف كنیم و در رسانه ها اعلام كنیم كه قتل آزاد است و هیچ گونه مجازات و نكوهشی متوجه قاتلان نیست، كسی بر روی این سیاره ی آواره زنده باقی خواهد ماند؟!
 آیا كسی زنده خواهد ماند؟؟

سال ها پس از مطرح شدن انیشتین به خاطر عنوان كردن نسبیت، دو شاگرد نخبه ی او به نام های هایزنبرگ و بور دو اصل عدم قطعیت و تمامیت را مطرح كردند كه امروز فیزیك كوانتوم با بهره گیری از این دو اصل بسیاری از اتفاقات متافیزیك را توضیح می دهد. می خواندم كه چون برای وجود هر موجودی حداقل یك وجود درك كننده لازم است پس این امكان وجود دارد كه وقتی ما از شی ای غافلیم، آن شی اصلا وجود ندارد. 
خاطرم آمد كه در كودكی به ساعت ها شك داشتم و گاهی برای اینكه آن ها را غافلگیر كنم، ناگهان به آن ها نگاه می كردم،  بلكه ببینم كه در غفلت من مشغول ِاستراحت هستند؛ و امروز می خوانم كه در غفلت من آن ها اصلا نیستند!! 
در غفلت من آن ها اصلا وجود ندارند. اصلا وجود ندارند...
 می گویند وقتی شاگرد انیشتین این مطالب را بر او آشكار كرد، انیشتین یك شب تا صبح را راه می رفت و صبح گفت:  ترجیح می دادم که اینطور نبود چون نمی خواهم باور کنم كه دنیا با ما تخته نرد بازی می كند.`,
		
Ending: `پایان
این تویی؟؟
اینا چرا...

این عکس پدر و مادرته...
تو اینجا به دنیا اومدی... 
این خونه رو یادته...؟؟؟
مادر بزرگت...
این اولین لباسته...
اینجا یاد گرفتی راه بری...
تازه داری غذا می خوری...
اولین باری که برف اومد... 
چقدر خوشحال به نظر می رسی!
این اتومبیلو یادته؟

اینجا یه کم بزرگتر شدی...
همبازی هاتو دوست داشتی؟
چرا اینجا ناراحتی؟ 
اینجا داری تنبیه میشی؟ 
«احساس تنهایی می کنی؟»
«احساس تنهایی می کنی؟»
 کسی هست که باهاش حرف بزنی...؟
 چیزی هست که بخوای بگی...؟

اینجا داری میری مدرسه...
مدرسه رو دوست داشتی!
این معلمتو چطور؟ می بینیش...
اذیتتم می کرد؟
دلت چی می‌خواد؟
می خوای بازی کنی؟
یا می خوای زودتر مدرسه تموم شه؟
مدرسه رو دوست داشتی!

اینجا چقدر ناراحتی...
دلت برای کسی تنگ شده؟
اینجا کسی رو از دست دادی؟
 پدر بزرگت؟ مادر بزرگت؟
چقدر واست مهم بود؟ . . . 
کسی بود که دوست داشته باشی کنارت باشه؟؟؟
چیزی بود که بخوای بگی؟؟؟

اینجا اولین بار شرمنده شدی... یادته چقدر خجالت کشیدی؟
کسی بود که دوست داشته باشی کنارت باشه؟؟؟ 
چیزی بود که بخوای بگی؟
چقدر واست مهم بود؟ 

این مسافرتو یادته؟
خیلی خوش گذشت...آره؟
خیلی خوش گذشت...خیلی خوش گذشت...خیلی خوش گذشت... آره . . .خیلی خوش گذشت...خیلی خوش گذشت... آره . . .خیلــی، خوش گذشت... آره . . .خیلی خوش گذشت...خیلی خوش گذشت...خیلی خوش گذشت... خیلی . . .خیلی خوش گذشت...


اینجا چقدر بزرگتر شدی! چقدر فرق کردی! . . 
یه کمی مغرور به نظر می رسی...
این مهمونی چقدر خوب بود... 
این آدما رو چقدر دوست داشتی...
این اولین کسيه که ازش خوشت اومد... اولین کسی که بهش اعتماد کردی...
دوسش داشتی؟؟؟ . . باهاش خوشحال بودی؟ . . 
الان اصلاً برات مهّمه؟؟؟

این آدما رو یادته؟ 
وای . . این روز وحشتناکو یادته؟
چقدر سخت گذشت...
«هیچ وقت به کسی گفتی؟؟؟»
«هیچ وقت به کسی گفتی؟؟؟»
«هیچ وقت به کسی گفتی؟؟؟»
 کسی بود که دوست داشته باشی اونجا کنارت باشه؟ . . فکرشم نمیشه کرد...!!!

اینجا رو یادته؟ . . . اولین باری که روت حساب کردن...
به خودت افتخار کردی! . . واسه این کارت چقــدر تشویق شدی...!!!

اینجا چقدر آرامش داشتی... از صورتت پیداست...
چه سخته منتظر اون اتفاق بد باشی... بهش فکر نکن...

مگه میشه...؟!! . . این تویی؟؟؟
چقدر پیر شدی...!!!
این آدما کی ان؟ . . . 
چقدر تنها به نظر میای!
چرا همه چیز کهنه ست؟ . . . 
چرا هیچ کسو درست نمی شناسی؟
کجا می برنت؟ . . . 
اینا چرا گریه می کنن؟

دوباره کسی رو از دست دادی؟
چرا اینقدر سر خورده ای؟؟؟
تو کسی رو از دست دادی؟
«کسی تو رو از دست داده...؟»
«کسی تو رو از دست داده...؟»
«کسی تو رو از دست داده...؟»
«کسی تو رو از دست داده...؟»
«کسی تو رو از دست داده...؟»
«کسی تو رو از دست داده...»
`
	,
		ArtificialChemistry: `شیمی مصنوعی
تو هر صبح در من بعد از بیداریِ ظاهری
به شکلِ درد حس می شی، جایی اطرافِ مری
یه جایی توی مغزم، به دیوارا می کوبی
جایی که نمی رسه، دستِ هیچ قرصِ خوبی

تا من به خواب برم با، شیمیِ مصنوعی

تو یه حفره تو سرم، کالبدی از تو مونده
اعتیادِ ذهنی به عاطفه ی آلوده
گاهی که لبریز از تو، به ارتفاع آغشتم
و نَم لیز می خوره ازمنحنی های چشمم

که روی آب بریزه، چیزایی که نوشتم

تو یه حفره تو سرم، کالبدی از تو مونده
اعتیاد ذهنی به عاطفه ی آلوده
تئوریِ محزونِ انتخابِ سراب از
چیزی شبیهِ خونو می نویسم رو کاغذ

تا من به ... برم با شیمیِ مصنوعی

از دیوارِ شنیِ گودالِ قلبِ ناتنیِ تو
هر روز بالا می رم و می رم و سُر می خورم به زیر
اضافه ی روحِ عادتی، پیوندِ لعنتی رو بگیر
شوقِ ترکیبِ لذت با تو و دیدنِ واکنش

که روی آب بریزه، چیزایی که نوشتم...

تا من به خواب برم با شیمی مصنوعی...`,
		CommunicationWithTheDeaf: `ارتباط با کرها
کنارِ بطری ها، برای نوشیدن
کنارِ کولی ها، برای رقصیدن

کنارِ بدن ها، برای خوابیدن
کنارِ وحشی ها، در حال جنگیدن

شش هزار و چهارصد قرن، برای فهمیدن
خروج از این چرخه، به جای پوسیدن

من عضوِ نامطلوب، برای این دستگاه
خطای تکنیکی تو آزمایشگاه

در حال حرف زدن برای دیوارها
برای درک شدن، برگشتن به غارها

شهرها لبریز از، مردها و زن ها
کنار انسان ها، من چه فکرم تنها

در حال کوبیدن، به تمام درها
دست بردن به فکرها، ارتباط با کرها

تقاطع، خسته از آمد و رفتن ها
تو ترافیک آدم، فکر من چه تنها

کنارِ احمق ها، برای خندیدن
کنارِ تو حتی، برای رنجیدن

من عضوِ نا مطلوب، برای این دستگاه
خطای تکنیکی تو آزمایشگاه `,
		YellowHarmony: `موسیقی زرد
به صدای من گوش نکن، موسیقیِ زرد داره
به قلبِ من دست نزن، بیماریِ سرد داره

به روحِ من نزدیک نشو که سال هاست طرد شده
به مغزِ من دست نزن، سرایتِ درد شده

و از همون دور به من حسِ ماورایی بده
از موجودی که جون داره به من یک تداعی بده

و مثل نقاشی به من خو کن از مجرای نگاه
که من حرکت نمی تونم از چارچوبِ قابِ سیاه

تو باش ولی موازی باش، همراه، ولی لمسم نکن
میل به ترکیب یا واکنش، یا هرچی می ترسم نکن

پِی‌ام نگرد که گُم می شم، با من نخواب که کم می شم
ترکم نکن که می میرم، بسامدهای بَم می شم

به سایه ی من دست نزن، که طیفی از هوس داره
طبیعتِ بی تابِ من، انقطاعِ نفس داره

به عطرِ من دست نزن، که تو سینه ت قفس داره
که اِستِنشاق بوی تو، اتصالِ عبث داره`,
		
ButtonOfDoom: `کلیدِ انفجار
با طناب های واهیِ دلتنگیِ گاه گاهیِ تو
نجات پیدا می کنم و زیرِ آب می رم
تو چاله های فضاییِ تصویرِ انتزاعیِ صورتت
هر روز به دام میفتم و به خواب می رم

از ارتفاعِ تخمینیِ روحِ وَرا زمینیِ تو
هر بار وحشت می کنم و سقوط می کنم
از شلوغیِ موسمیِ دورانِ نو بلوغیِ تو
از دل تا لب می رسم و سکوت می کنم

از اینکه تو آزمایشگاه، دکتر منو 
زیرِ میکروسکوپِ آزمایشِ انتهایی قرار می ده
بعد از گزارشِ نتیجه به رییس، با دستور اون 
کلیدِ انفجارِ آزمایشگاهو فشار می ده

از گردبادی که ساختی و طوفانی که راه انداختی
تو خشکِ خشک می شکنی و من تَر خم می شم
از تهوع ِافتادن و میل به پس دادنِ میوه های سمی 
تو می میری و من کم می شم

با اینکه می بینم تو هم، تو کانونِ توجهم 
به ریشه های درخت می خندی، درک می کنم تو رو
از آبشارِ زمان و محدوده ی‌امکان و این جهان 
پا بیرون می ذارم و ترک می کنم تو رو`,
		
UnderneathTheOcean: `اقیانوسِ انزوا

به زندگی زیرِ اقیانوسِ انزوا
به خوابیدن تو عمقِ آبی تیره ی دریا

به آرامش بیشتر از هوا محتاجم، همین
تو روی آب برقص و دنیا رو بیشتر ببین

من از سرب های تَنَم سبک می کنم تو رو
من از خوابِ زیرِ آب، بیدار نمی شم برو

ای شبحِ تکراری، که دست بَر نمی داری
برو باید فکر کنم تو وضعِ اضطراری

به پیرامونِ خلوت، سوتِ سکوتِ ممتد
به سکونِ عاطفی، توقفِ جزر و مَد

به بی وزنی بیشتر از جاذبه نیاز دارم
به پرواز روی دره اشتهای باز دارم

به تنهاییم توی جمع، به ازدحامِ فردی
به ارتفاعِ روحم که دست پیدا نکردی

خاکِ مرغوبِ کِشتِ هویت های بیمار
پا از قلمروی قلب، دست از ذهنم بردار `,
		People: `مردم
مردم اجزای روحمو ارزون به تاراج می بَرَن
تو آخرین سالِ دنیا به روز خوشبختی می‌خرن

فقط تماشا می‌کنم  انگار برام هیچ مهم نیست
به تدریج تبدیل شدم به یک بیمارِ پست‌مدرنیست

حس چیزایی که می گم تو هیچ جای صورتم نیست 
حتی افکارم شبیهِ فِرِیم‌های حرکتم نیست

تأثرِ مردمو با سر تایید می‌کنم
واکنش عاطفیِ اون‌ها رو تقلید می‌کنم

به باغ وحش باورم صبح‌ها گوشتِ خام می‌برم
برای برگشتن به شهر، اسلحه و دام می‌خرم

مردم در پِیِ توسعه و من افول می‌کنم
مردم چیزای بد می‌خوان و من قبول می‌کنم

تو رو اضافه می‌کنن به جشنِ قهرمانانه
شب ها تو رو خط می زنن از لیست‌های محرمانه

مردم نبوغ می‌خرن و احتکار می‌کنن
با ایده‌های تو ولی، مردم چکار می‌کنن

برایِ منِ خوب از دور هورا چه راحت می‌کشن
مردم تو رو نزدیک می‌خوان تا به کثافت بکشن

مردم تحمیل می‌کنن هوا نیازِ فوری نیست
مردم توجیه می‌کنن و می گن این که طوری نیست

مردم برای خودکشی یک ابتکار می‌کنن
با پیشگیری از زندگی، مردم چکار می‌کنن؟! `,
		FreeSpirit: `روحِ آزاد
یک شبِ سرد، تو خیابون، تو دستات ها می کنی
خودتو مقابلِ دو چشم پیدا می کنی

با نگاهت حس مرموزی رو القا می کنی
وجودت به وجد میاد؛ اما حاشا می کنی

عشقِ من تو هر روز، فُرم به فُرم در تغییر
از همه نسیم و طوفان، تحتِ تاثیر

من همونم که تو رو اینطور ترسیم کردم
قلب آزرده تو، تو آغوشم ترمیم کردم

کسی که زخم های روحتو جراحی کرد
شب و روز بی وقفه افکارتو طراحی کرد

قلبمو مشغولِ جمله های ساده ت کردم
و به سختی به وجودِ ساده ت عادت کردم

تو رو بی نیاز از آرزوی واهی کردم
من تو رو به دنیای واقعی راهی کردم

حسِ خنثایی که تو روحِ آزادت هست
همه چیزی که از من هنوز توی یادت هست

درونم حس می کنم جوششِ موهومی
لحظه هایی از دور که تو نا آرومی

دشمنِ زیبایی از عصاره ی خودم
با فراموش کردنِ تو از خودم محو شدم

تو ازم دور شدی و من بی تاب شدم
روز تحمل کردم شب ها بی خواب شدم

من کمی وقت می خوام تا اَزَت سرد بشم
شبیهِ دنیایی که لِهم کرد بشم
`,
		NaturesGuilt: `گناهِ طبیعت
داره مردمک ِچشمِ زیبات گشاد می شه
داره جریانِ خون توی مغزت زیاد می شه

صحنه هایی که دیدی رو باور نداری
گریزی از حقیقتِ زجر آور نداری

تو اتاقت مشغولِ قتلِ عامِ انفرادی
اینکه پیغاماتو سیزده روز جواب ندادی

می خوای تمامِ بافت های حافظه تو از دست بدی
می خوای تجربه ی مسمومتو به دنیا پس بدی

با احساسِ یک حیوونِ زخمی سمتِ آب میری
داری زخماتو لیس می زنی و آروم به خواب میری

صُب تو جنگل بیدار می شی و اسمتو یادت نیست
به جز بوی انتقام تو زمینِ آزادت نیست

توی آرواره هات حس می کنی دردِ زیادی
یعنی تو خواب دندوناتو رو هم فشار می دادی

اینکه هندسه ی صورتت شبیه به حیوونا نیست
یعنی تو نسلی هستی که انتخابِ اونا نیست

اینکه هر جا میری اون صحنه ها رو هم می بری
یعنی مثلِ گرگ آدمای بی گناهو می دَری

اینکه تو محصولِ کشتِ انسان تو باغِ وحشی
یعنی تو گناهِ طبیعتو هرگز نمی بخشی

اینکه رفتارِ مردم شبیه به اینکه می خوانت نیست
یعنی ذره ی زنده ای تو طبیعت نگرانت نیست

اینکه تو فَکِت حس می کنی دردِ زیادی
یعنی دندوناتو تو خواب رو هم فشار می دادی

اینکه تو نوزادِ درنده ی همین فصلی
اینکه حلقه ی بعدی زنجیره ی تولیدِ نسلی `
	,
		FinalRun: `فرارِ آخر
تو فرارِ آخرم از یخبندان های تو
به قتل می‌رسم به دستِ مرزبان های تو

مارپیچ و متروک، همه اتوبان های تو
شهرها به ترتیبِ سفیدِ دندان های تو

راننده های بی هدف با قلب های مُنفعل
بینِ این همه جسد، من بُحرانِ مستقل

تونل های خاطره همه منتهی به تو
رو پل های حافظه من تحتِ تعقیب تو

روزهای اول به نجات امید می‌ورزی
هفته‌ها پس از فرار مثلِ بید می‌لرزی

نورهای شناسایی از فانوس های تو
ابرهای تیره پوش که جاسوس های تو

جاده ها همه مسدود از بهمن های تو 
نا امن از توهم ها این راهزن های تو

من چکار می کنم سال ها بدونِ تو
جز فرارِ نافرجام از طاعونِ تو`,
		ONegative: `اُ منفی

اشتباهی که با صبر داره تغییر نمی کنه
انتقامی که سال هاست خشمتو سیر نمی کنه
هیچ کس مثل تو منو زیبا گمراه نمی کنه
هیچکس مثل من به این دقت گناه نمی کنه

نفرتِ چشم های تو میلمو کم نمی کنه
شاهدِ لالِ قلبِ من هم تبرئه م نمی کنه
ماشینِ دروغ سنج هم به من کمک نمی کنه
حسم از قلبِ من عبور به مردمک نمی کنه

این مرز که نیازمو به رفتن درک نمی کنه
میل به سکونِ چسبناکی که منو ترک نمی کنه
انتظاری که هیچ مُنجی اجابت نمی کنه
اسراری از تو که سنگ هم امانت نمی کنه

تنهاییِ بی وصفِ خونِ ا منفیِ تو
بدرقه ی غمناکِ مامورهای مخفیِ تو
احتیاطِ رد شدن از باتلاقِ دلتنگیِ تو
از همه چیز گذشتن تو منطقه ی جنگیِ تو

آتشفشانِ وهمِ من استراحت نمی کنه 
ارتفاعِ متروکی که عُقاب طاقت نمی کنه
تلاطمِ هولناکی که قبلا تو کتاب خوندم
هفته ها روی موج های سطحیِ خواب موندم`,
		Eavesdrop: `شنود
		...`,
		Juggle: `شعبده
فرارِ مردمَک ها از چشم تو چشم شدن ها 
دنبال کردن پاها، لب ها و بدن ها

توی این سالنِ شلوغ و نبودن در امنیت 
گوشه گیری از جنسیتِ بودن در اقلیت

سَندرومِ بیقراری پا به اطراف
یعنی تو خسته ای از مَردِ حرّاف

حسرت آرزوهات که مدفون شدن توی نای
یعنی تو جات اینجا نیست، یه چیز دیگه می خوای 

چیزی که تا یادت هست برای اون غم داشتی
کسی برای نجات که همیشه کم داشتی

راهبه های چشمات به من بها نمیدن
تو کلیسای قلبت به من خدا نمیدن

در انتظار منجی که هرگز نیومده 
و من روبروی تو ناتوان از شعبده

کنار پیشخوانِ بار، مشغول تخمیر شدن
نوشیدنِ مدام تا لَخت و بی تاثیر شدن

تو نقاشیات میاد همه چیز عوض میشه
رو زمین نه، ولی سهل روی اون کاغذ میشه

راهبه های چشمات به من بها نمیدن
تو کلیسای قلبت به من جا نمیدن

بی اعتناست نگاهت به ژِن های کِشت من
به چشم تو نمیاد جوجه اردک زشتِ من`,
	
	PackedLife: `زندگی بسته‌ای
ز بسته ی رَحِم تا جعبه ای به نامِ گور
میل به حمامِ داغ تا اتاقِ خواب کور
برای تو که با اعتماد مخالفی
یک قفسِ سگ از امنیتِ عاطفی

برای تویی که نمی رسی به بهشت 
یک فرمول برای تعویقِ سرنوشت
این فهرست از مایحتاجِ بسته ای
از جنگ که می رسی و پیداست خسته ای

من تو این قفسه، جای همیشگی 
تهِ راهروی فروشگاهِ زندگی
کمی ملاتونین به جای کیسه خوابِ نرم
کنسروِ خزندگان در اِزای غذای گرم

سِرترالین، خوشبختیِ زود و مُفت
جعبه های قرصی به نامِ زُلُفت

ما تراشه های ژنتیکی تو بسته های جدا
از کارخونه ی بسته بندیِ شاید خدا
محکوم به تولید مثل تو دستگاهِ حادثه
با غریزه ی دلپذیری به نامِ لامسه

با فریبِ آلوده ی دوست داشتگی
محبوبیتِ اکسیژن از وفور و هرزگی
دعوتِ لوسیفرها به کسبِ ویژگی 
از موجودی با طبیعتِ روزمرگی


ما تراشه های ژنتیکی تو بسته های جدا
محصولِ کارخونه ی بسته بندیِ شاید خدا
محکوم به تولید مثل تو دستگاهِ حادثه
با غریزه ی دلپذیری به نامِ لامسه`,
		HazeToClarity: `مه تا وضوح
با پوستِ صورتم بگم 
به بالشِ کَرَم بگم
با مورس های مردمک 
از جعبه ی سَرَم بگم

از هسته ی غمم بگم 
با زبونِ تَنَم بگم
به انعکاسِ صورتم 
رو شیشه ی تَرَم بگم 
به شیشه ی تَرَم بگم

با بال های روح برم 
به مرزِ ابر و کوه برم 
از راهِ تو در تو برم 
از مه تا وضوح برم 

به جای دوری کوچ کنم
برم تو رو از دست بدم
یک شهر طراحی کنم
به آغوشِ تو بسط بدم

به خوابِ طولانی برم 
با ذهنِ کیهانی برم 
فقط با یک آرزو 
به دشتِ مرجانی برم

برم یه غارِ ساده رو
جایی شگفت انگیز کنم
دروغ های زیبامو
هر صبح تمیز کنم 

یه سنگو پشتِ آبشاری
پر از گیاهِ هرز کنم 
یه تختِ نرم بسازمو 
تو رو کنارم فرض کنم`,

		Verticalcemetry: `گورستان ایستاده
وحشتِ بی دلیلِ من از روزهای فرد
نرم افزارِ عاطفه، کدهای لذت و درد

شغلِ طاقت فرسای سرگرم کردنِ تو
خستگیِ جونکاهِ کار تو معدنِ تو

گورستانِ ایستاده، زنده های معمولی
میلیاردها سال برای بلوغِ تک سلولی

غرورِ غم انگیزِ تنهایی تو ارتفاع
سبک کردنِ بغض تو سرویسِ هواپیما

سَرَم سَردَرِ شهرها، شوشتر تا بلخِ تو
قربانیِ درکِ فلسفه ی تلخِ تو

انقراضِ مرموزِ نهنگ های آبی
هدایتِ طبیعت به مرگِ اکتسابی

باز معلق شدم تو قرن های اشتباه
از انسانِ بَدْوی، تا توربین های گناه

 این سطح از درد برای پوستِ نازکِ یک روح
برای پیر شدن تو یک روزِ از عمرِ یک نوح`,
	
	TheOneILovedToBe: `کسی که دوست داشتم باشم
رو تخت تَنِت یک روباتِ مچاله ست 
دست هات منطبق بینِ کشاله ست 
اون سایه اومده واسه ملاقات
اما نه برای گوش دادن به حرفات 
اون اینجاست با زنجیر برای دست هات 
اون اومده با یک لیست از شکست هات 
اون امیدهای مُرده ست از خودِ تو
اون آرزوی سوخته ست که شده تو
پوستم نمی پوشونتم 
چشمم نمی خوابونتم 
کسی که می خواستم باشم
آروم نمی ذارتم 
از آرشیو بیرون می کِشَتم 
و دستگاه باز می خونتم 
کنارِ تو می ذارتم
به حرف وا می دارتم
کسی که دوست داشتی باشم 
به تو بر نمی گردونتم

یه خبر تو راهه، نه به این بی رحمی 
همه چیز خوب می شه، اینو زود می فهمی`,
		
WhereDoIComeFrom: ` کجایی‌ام
زل می زنی به ابزارِ بینایی‌ام 
می پرسی از من که کجایی‌ام

مخترعِ عاطفه ی پلاستیکی‌ام 
مبتکرِ جملاتِ مکانیکی‌ام 

من سرعتِ مغزهای شیمیایی‌ام 
من نیاز به دانشِ مومیایی‌ام 

لذتِ کشف های ماورایی‌ام 
من انزال های غم در تنهایی‌ام 

من شاعر قرن های جدایی‌ام 
من ساکن شهرهای انتزاعی‌ام 

حمله ی هورمون های ارگاسم زایی‌ام 
من حاویِ متون پر تداعی‌ام 

دنیایی که چشماتو می بندی‌ام 
من دلیلِ ترس از بلندی‌ام 

من دقتِ ریزِ ایده آل خواهی‌ام 
من وسواسِ نگاهِ پادشاهی‌ام 

من تنهاییِ بی وصف در اقلیتم 
من لذت های عشق در امنیتم 

قهرمانِ زندگی های موازی‌ام 
من دستگاهِ این نوع شبیه سازی‌ام`
	,

		
		GreenRobans: `روبان سبز
ای سیبِ سبز از بهشت، قاصدِ نور از سحر
از دور به تو خیره ایم، از دور با چشمان تَر

از بین مه و خلاء،  با آهنگِ تندِ نبض
بیقرارِ بوی نو، بیتابِ یک سیبِ سبز

حرف بزن حرفی ای سیب، از حنجره های ما
باغِ سبز نشان بده، از پنجره های ما

ای سیبِ سبز از بهشت، قاصدِ نور از سحر 
از دور به تو خیره ایم، از دور با چشمان تر

گلبرگِ سرخ های ما که بر زمین باریدند
برگیر و تیمار کن که از تگرگ رنجیدند

ببین هزاران و یک روبانِ سبز زنجیرند
تا پر غرور بر قله، در آغوشت بگیرند

هی سیب سبز از بهشت، ای قاصد بوی مُشک 
از دور می خوانیمت از دور با لب های خشک

تو نیستی یک تن ببین، هزاران و یک نفر
کانونِ قلب های سبز، یک فکر یک چشمِ تَر

ای سیب سبز از بهشت، قاصدِ بوی شبنم
امروز می خوانیمت امروز با دل های غم 

در چشمانت لبخندی از پیرِ مهربانی 
بر لبخندت آهنگی، آوای آسمانی

سردارِ تشنگان را، نامِ خوش بر توست زین بین
ذکرهایش همراهِ توست، قهرمانی چون حسین`,
		
NothingWillGetBetter: `هیچ چیزی بهتر نمی شه
یکی مثل تو که می ره، یکی مثل من می میره 
یکی شکل خدا هر چی  داده، یهو پس می گیره 
هوا روشن می شه ولی چرا دلت هنوز شبه ؟
و زندگیت توی گلوت، هر روز نزدیکتر به لب ِ 

بَدِت میاد از باورت، هوای مرگ توی سرت 
می خوای تموم بشی مثل آرزوهای پَرپَرت 
یکی مثل تو نمیاد گرم کنه این تن سردو 
اما من هر روز زنده تر که بیشتر حس کنم دردو 

تو پاره ی قلبمی که خون ازت می گذره 
تو رو ازم بگیرن ، راحتمو می بَره 
تو گوشه های لبی که با تو می شه خندید 
تو رو ازم بگیرن ، احساسمو می شه دید 

یکی مثل تو نمیاد و هیچ چیز بهتر نمی شه 
روزهای سختی میگذره، باقی مونده هنوز ریشه 
کسی جاتو نمی گیره، هیچ چیز آروم تر نمی شه 
که یک حسِ وحشی میگه هیچ چیزی بهتر نمی شه 

تا یک فرشته می رسه بعد از سال های دراز 
و گوشه های لبِ تو دور از هم و به خنده باز 
ببین آفتاب هنوز گرمه، نورش هیچ کمتر نشده 
اما خوب که فکر می کنی هیچ چیز هیچ بهتر نشده 

هیچ چیزهیچ بهتر نشده 
هیچ چیزهیچ بهتر نشده 
هیچ چیزهیچ بهتر نشده 

تو تسکینِ یه دردی که سال هاست با منه 
تو رو ازم بگیـرن بنیانمـو می کَنه 
تو قسمتی از چشمی که خواب با تو ممکنه 
تو رو ازم بگیرن تا صبح پلک نمی زنه 

یکی مثل تو نمیاد و هیچ چیز بهتر نمی شه 
روزهای سختی می گذره، باقی مونده هنوز ریشه 
کسی جاتو نمی گیره، هیچ چیز آروم تر نمی شه 
که یک حس وحشی می گه هیچ چیزی بهتر نمی شه`,
		
BlackRose: `رز مشکی
جسدِ یک رزِ مشکی، همه چیزی که از تو دارم
بعد از ظهرهای غمگینم، که از تنهایی بیزارم

و توهم هایی کوتاه، که نشستی تو کنارم
مهِ نزدیک به زمینم، رودِ نزدیک به آبشارم

بافت های حافظه در مغز، خاطره های اجباری
زندگی زیرِ جهنم، تنها انتخاب که داری

رو اندازی که الیافش، عطرِ خواب با تو رو می ده
لبه ی لیوانِ آبی، که لبِ تو رو چشیده

آب و آفتاب و لالایی، همه چیز که به تو دادم
رزِ مشکیِ نزدیکم، ابرِ در تاثیرِ بادم

تَنِتو بین شکافی، روی پوست تَنَم کاشتم
روحتو همراهِ خونم، توی رگ هام نگه داشتم

رزِ مشکیِ برهنه، تو فصلِ پنجمِ سالِ سرد
دو هویت تو یه کالبد، یعنی همزیستیِ پر درد

حسِ دور موندنِ از تو، بین دو قطب یه بازی
ملاقاتِ هر شبِ ما، تو زندگی های موازی

میوه ی درختِ وهمم، رزِ مشکیِ بی نقصم
وسطِ پاییزِ ساکن، برگَکِ در حالِ رقصم

ارتفاعِ دست نیافته، به بلندیِ مستی ام
برفِ همراهِ طوفانم، قسمتِ فراهستی ام`,

		MercurialFountains: `فواره‌های جیوه‌ای

من ساکن سرزمینی که از قلمروی خدا
با دیوارای شیشه ایِ بلندی شده جدا

پیش از تبعیدِ من خدا روحو از پیکرم مکید
و تو فرشته ای بودی که روحمو در تو دمید

تراشه های تبعیدی شب ها در امتدادِ مرز
در کمینِ تصاحبِ قلبِ فرشته های هرز

و من که روحم گم شده تو خواب حس می کنم بویی
گاهی تصویرِ مبهم از تحققِ آرزویی

عطرِ گیاهِ تازه ای زیر پای برهنه تو
حس می کنم این وَرِ مرز و ارتعاشِ خنده تو

فواره های جیوه ای که می بارن روی تنت
با وزشِ بادِ مرطوب سُر می خورن رو بدنت

از پشتِ شیشه های مرز گاهی زل می زنی به من
فکر می کنی نقاشی‌ام، تصویرِ ذهنیِ یه تَن

فکر می کنی من محصولی از چرخه ی طبیعتم
طوفانِ ساحلی گاهی تا لبِ مرز میارتم

تو هیچ ایده ای نداری که من خودِ بیگانه تم
و تو آرومِ روحمی و من خودِ بیگانه تم

تو هیچ ایده ای نداری که تو همه وجوهمی
سلول های قلبمی، زیر ذره های روحمی

تو هیچ نمی دونی که تو همون منِ دیوانه‌ای
تو برای روح خسته م زیباترین پیمانه‌ای

و ابرها پایین میان و رو شیشه پر نم می شه
و صورتت با لبخندی از دیدم محو و کم می شه`,
		
Xanax: `زاناکس

وای این تصویرِ تکراری از صورتِ تو توی خواب
پلک های نیمه بازِ من دوباره پُر شدن از آب

جزییاتِ صورتت که ارسال میشن به حافظه
تحلیلگری به نامِ ذهن که از درکِ عشق عاجزه

تصمیمِ مغز برای واکنش دادن به خاطره
توسطِ اعصابِ منتهی به قلبِ باکره

ترشحِ هورمون های تحریکِ درد توی خونم
با سرخرگ ها پیغامِ درد می رسه به همه جونم

چرندیاتِ بی ربط و پولسازِ دکترِ پلید
تجویزِ صورتی و روتینِ اون مردِ سفید

یک افتضاحِ عاطفی طبقِ قوانینِ مورفی
یک ماده ی شیمیایی که می کنه معرفی

بی تامل تو قفسه، پِیِ قرص های صورتی
یک محصولِ شیمیایی، فرآورده ی صنعتی

بلعیدنِ صورتی ها برای فتحِ راحتی
برای رخنه کردن به دیوارهای امنیتی

برای فرار از خودِ منِ به تو عادتی
جذب از دیواره ی معده، ورود به خونِ لعنتی

و پولک های صورتی هجوم می بَرَن به مغز
و آروم دفنت می کنن اجسادِ خاطراتِ نحس

ذهنم دست بر می داره از ادامه ی تایید و نقض
و بی وزنی کم می کنه کمی از بی تابیِ نبض

پا توی ساحل می ذارم بیرون از درهای قفس
و بغضم پایینتر میره کمی از مجرای نفس`,

		GoodHappening: `اتفاق خوب

وقتی فرسنگ ها دور از من احساسِ دلتنگی کنی
قلبِ من روزهاست سرد شده از این عشقِ تقارنی

وقتی ساعت ها بعد از این روزهای تنهایی داری
ذهنِ من دست کشیده از توهم های تکراری

وقتی تمامِ سلول هات یه آغوشِ امن می خوان
وقتی همه خاطره های لعنتیت به حرف میان

تَرکَم که می کردی نورِ فانوس های دریا مُردن
موریانه های خیال قایقِ نجاتو خوردن

فرشته های دریایی منو به موج ها سپردن
امواجِ سهمگینِ وحشت منو تا مرزِ مرگ بردن

وقتی تمامِ حسرت ها به مرگ اضافه ت می کنن
وقتی همه غم های فلسفی کلافه ت می کنن

غم ها که هر چقدر می خندی احاطه ت می کنن
نفس ها به بوی جسد به تدریج عادت می کنن

وقتی می خوای با دیوارا حرف بزنی و ممکن نیست
وقتی تو مجرای نَفَس چیزی جز بغضِ مزمن نیست

وقتی اطرافت همه چیز اونقدر خوبه که سیر شدی
می بینی تو انتظارِ اتفاقِ خوب پیر شدی

وقتی وجودت خالیه و از درون درد می کِشی
چشمای پر اشکتو به شیشه های سرد می کِشی

وقتی همه جونتو از نیاز به بوسه می دَری
برای بوسیده شدن پناه به عکس ها می بَری

وقتی من نیستم که روحِت زیرِ پوستم گرم بمونه
وقتی من نیستم که روحِت زیرِ پوستم گرم بمونه`,
		
Revengemachine: `ماشین انتقام
فکر می کنی که عوضی شدن یه کارِ ساده بود
فکر می کنی این اتفاق از ابتدا افتاده بود
وقت می بره آماده شی، تجزیه شی و ساده شی
برای جراحی قلب، بی حس و بی اراده شی

کودکیِ بازی شده، روانِ دستمالی شده
درد برده تا که دست به دست از ظرافت خالی شده
زحمت داره که سرد بشی، تو سایه باشی طرد بشی
کار گروهی می بره، نبیننت که زرد بشی

از میوه بودن خسته شی، فکر می کنی که راحته
خشمگینِ ساکتی بشی، که طراح خیانته
ماشینِ انتقامی که سرگرم جراحته
به انتقام که میرسه، که وقت استراحته

ارتعاشاتِ انسانیت، چگالیده به ماده شه
نفس نکش، مبادا بغض از گلوت پیاده شه
پیشرفتگیِ تنهایی تا استقلالِ احساسی
انقلابِ درونیِ انتقام های وسواسی

یک لیست آرزو کشی، که قبلِ خواب مرور کنی
از حذفِ پاره ی تنت، احساس غرور کنی
ماشین انتقامی که سرگرم جراحته
شب به ستاره می رسه که وقت استراحته

ازت هیولا بسازن که باور کردنی ت کنن
کار گروهی می بره یه بمب مدنی ت کنن

فکر می کنی که راحته، که دوز به دوز هدر بشی
شب وقت استراحته، که صبح پرخطر بشی

هادی پاکزاد
مهر ٩٣`,
		Darviniam: `تکامل داروینی‌ام
اون خونه تاریک بود و من اتفاقی
از لای در دیدم تو تخت با یک کلاغی
پرهای کثیفی داشت، پاهای کوتاهی
سرگرم بود با تو به کارهای سیاهی

بیرون زدم و دیدم شهر تاریکِ مطلقه
مردی که حلق آویز شده تو باد معلقه
درهای خونه ها جلوش لاشه های سگه
دشمن به شهر زده؟ چقدر درنده ست مگه؟

من و اندوهی که بلعیده شد همراه بزاق
تو و اجتماع دختر بچه ها تو اون اتاق

تو و دست پشت پرده هایی که در کاره
منو ذهن سی و دو-سه ساله-م که درس داره

توئِ مبتذل ترین نقاشی زنده ی مرد
بی سر و ته ترین توجیه تاریخ از یه درد

تو به هر حیوونی که یه شب تخت بدی
هرکسی رو به خودت عادتِ سخت بدی

تو به هر سنگدلی لذت ناب بدی
با صدات هرکسی رو عادتِ خواب بدی

تو به هر هالویی این همه وقت بدی
تو به هر بی رحمی که جا و رخت بدی

تو به هر ترتیبی به کسی مهر کنی
و به هر جادویی قلبی رو سحر کنی

تو به عمق مارپیچ و مهلک این دوستی
من به سطح کف یک دست تماس پوستی

من و آرزوی بیرون شده از حوصله ی کوتاهت
من و مکاره نگاه چشم های روباهت

تو کنار من تنهایی با فکرهای بالینی‌ام
من چند روزی برای تو خوشبختی تمرینی‌ام

تو برای طفره رفتن از تکامل داروینی‌ام
تو بیشتری از یک نفر یا دچار دوبینی‌ام

تویی مبتذل ترین قسمت هامونِ خودم
تویی زخم لبم از فشارِ دندون خودم

منم آرزوی بیرون شده از حوصله کوتاهت
من و مکاره نگاه چشم های روباهت

تا خوابت می بره روی این پاهای زمینی‌ام
من تنهاترین خوابی که تا صبح نمی بینی‌ام

رطوبتِ موازیِ شورِ اطرافِ بینی‌ام
زل می زنی به رفتارِ مرموزِ دوپامینی‌ام

با ترس رفتن زودت از طرزی که می شینی‌ام
بیقرارم تو دنیای فنیل-اتیل-آمینی‌ام

تا خوابت می بره روی این پاهای زمینی‌ام
من تنها ترین خوابی که تا صبح نمی بینی‌ام

با زندگی تاریک دانشمند برلینی‌ام
با تصمیم های کوتاه و تغییرات درونی‌ام`,
		Kabala: `کابالا
یارِ خیال و فرضی‌ام، میانه رو نمی شود 
بی شباهت به تو که نه، خُب خودِ تو نمی شود 

بوی لباسِ تو کمی، بر تنِ تخت می خزد
در بغلم مثل خودِ عطرت ولو نمی شود

وارونگیِ خواب هست، از شب به صبح می رسم
وقت قدیم صبح ولی، هیچ شبی نو نمی شود 

مزرعه را تو شخم زدی؟ قلبم برون آمد از آب 
عذاب و انتظار، ولی، وقتِ درو نمی شود

چایی که می خوردیم ما، بی پا و سر می شدیم
 هر قرص که می خورم، چُنان تلو تلو نمی شود

 هر چیز که مانده از تو را، به هیچکس پس نمی دهم 
هم ارزِ آنچه بردی از تنم، گرو نمی شود

موسیقیِ هر جاییِ تحمیل شده ات به خلوتم
 جهنم دره ای نیست که در آن امر به شنو نمی شود 

به هر جمعی که می روم، فاحشه خانه ای دستی، نیست
که آسان عکس های تو، در آن منو نمی شود

یکی قلب بود و یک سوگند، حسابت اشتباه بود اما 
این چه یکی ست با آن یکی که جمعش دو نمی شود؟

سلسله‌ی فرگشتِ من، که می لنگد اسپرمِ آن
برگشت نمی کند به قبل، نیز به جلو نمی شود 

 در امتدادِ سال هایی، که گندم کِشت می کردم 
دانسته ام برای سیر، آب، آبِ جو نمی شود

مردم فکر می کنند من عاشقانه می گویم
 کابالا در کمالِ من، دنیا لِگو نمی شود`
}

