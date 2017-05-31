var _ = require("lodash");
var TelegramBot = require('node-telegram-bot-api');

var token = '203511092:AAEMxqUW46BH-8jHViug6box5AkAYDDHCxs';
// Change this to wenhook fastest as you can (‍‍‍~mehrad)
var bot = new TelegramBot(token, { polling: true });
console.log("[...]Conected...");
var ostan = ["آذربایجان شرقی","آذربایجان غربی","اصفهان","البرز","ایلام","بوشهر","تهران","چهارمحال و بختیاری","خراسان جنوبی","خراسان رضوی","خراسان شمالی","خوزستان","زنجان","سمنان","سیستان و بلوچستان","فارس","قزوین","قم","کردستان","کرمان","کرمانشاه","کهگیلویه و بویراحمد","گلستان","گیلان","لرستان","مازندران","مرکزی","هرمزگان","همدان","یزد"];




var replyKayboardMobile = {keyboard:[[{text: "بفرست",request_contact: true}]],"one_time_keyboard":true};
var replyKayboardGender = {keyboard:[[{text: "مرد"}, {text: "زن"}]],"one_time_keyboard":true};

var intro = "به ربات رسمی هادی‌پاکزاد خوش‌آمدید. توسط این ربات می‌توانید ترانه‌ها و آهنگ‌ها و .... هادی پاکزاد را دریافت کنید. برای دریافت آهنگ مدنظر خود نام آن را جست‌وجو کنید یا از منوهای زیر یکی را انتخاب کنید.";
bot.onText(/((\/start|start|شروع))\b/,  function (msg, match) {
    
});


bot.on('text',  function (msg, match) {
    var title = msg.text;
    
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
        }
        else{
            var options = {
                parse_mode:"HTML",
                reply_markup: JSON.stringify({
                    inline_keyboard: keys
                })
            };
            bot.sendMessage(msg.chat.id, sent, options);
        }
});


bot.on('audio',  function (msg, match) {
    	bot.sendMessage(msg.chat.id, msg.audio.file_id + "\n\n"+ msg.audio.title);
});




bot.on('callback_query', function onCallbackQuery(callbackQuery) {
    const action = callbackQuery.data;
    console.log("["+callbackQuery.from.first_name+"|"+callbackQuery.from.username+"][callback_query]==> ",action);
    const msg = callbackQuery.message;
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

// function ask(chatID, askWhat) {
// 	if (askWhat == "gender"){
// 		bot.sendMessage(chatID, "جنسیتت چیه؟", {parse_mode:"HTML", reply_markup:replyKayboardGender});
// 		return true;
// 	}
// }

// bot.onText(new RegExp(ostan.join("|")), function (msg, match) {
// 	console.log("ostan Achived");
// });

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

// bot.onText(/\/((survey_))\w+/, function (msg, match) {
// 	var surveyID = msg.text.substring(8);
// 	user.findOne({ 'chatID': msg.chat.id}, function (err, docs) {
// 		if (err) return err;
// 		var surveyFilter = _.filter(docs.userSurveys, function(opt) {return opt.id == surveyID});
// 		if(surveyFilter[0].done === true) return bot.sendMessage(msg.chat.id, "این پرسشنامه برای شما موجود نیست.", {parse_mode:"HTML",reply_markup: {hide_keyboard: true} });
// 		console.log(surveyFilter,"Ss-------fF");

// bot.onText(new RegExp("شروع کن"), function (msg, match) {
// 	user.findOne({ 'chatID': msg.chat.id}, function (err, theUser) {
// 		if (err) return err;
// 		if(theUser.curenntSurvey.id == 0){
// 			return bot.sendMessage(msg.chat.id, "شما پرسشنامه‌ای را انتخاب نکردید!", {parse_mode:"HTML", reply_markup: {hide_keyboard: true} });
// 		}
// 		var theAnswer = new answer({
// 			userId: msg.chat.id,
// 			surveyId: theUser.curenntSurvey.id,
// 			questions: []
// 		});
// 		theAnswer.save(function (err) {
// 			if (err) console.log("save ERROR:" + err);

// 			console.log("New theAnswer Saved | chatID: " + msg.chat.id);
// 			new nextQuestion(msg.chat.id, theUser.curenntSurvey.id, theUser.curenntSurvey.qid);
// 		});
		
// 	});
// });

// bot.onText(/^([0-9])$/, function (msg, match) {
// 	console.log("num enterd: ",msg.text);
// 	user.findOne({ 'chatID': msg.chat.id}, function (err, theUser) {
// 		if (err) return err;
		
// 		if(theUser.curenntSurvey.id == 0)
// 			return bot.sendMessage(msg.chat.id, "متاسفانه این پرسشنامه برای شما منقضی شده. /start را بفشارید.", {parse_mode:"HTML", reply_markup: {hide_keyboard: true} });


// 		answer.findOneAndUpdate({userId: msg.chat.id, surveyId: theUser.curenntSurvey.id }, {
// 				$addToSet: { // Update questions array ^_^
// 					'questions': {
// 						"qid": theUser.curenntSurvey.qid,
// 						"answer": msg.text
// 					}
// 				}
// 			}, {}, function(){
// 				console.log("answr update Done");
// 			}
// 		);
		

// 		user.findOneAndUpdate({
// 			chatID: msg.chat.id
// 		}, {
// 			$set: {
// 				curenntSurvey :{"qid" : theUser.curenntSurvey.qid + 1 ,"id" : theUser.curenntSurvey.id}
// 			}
// 		}, {}, function(){
// 			new nextQuestion(msg.chat.id, theUser.curenntSurvey.id ,theUser.curenntSurvey.qid+1);
// 		});

// 	});
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
    Scientist: ['Scientist',`scientist`,`افلاطون`,`انیشتین`,`اهم`,`نسبیت`,`ساعت`],
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
    GreenRobans: ``,
    NothingWillGetBetter: `CQADBAADwAEAAq8LYVHQwbmDsaADuAI`,
    BlackRose: `CQADBAADvAEAAq8LYVFv2xLUEaBumAI`,
    MercurialFountains: `CQADBAADvQEAAq8LYVHL0-aLc4ELGAI`,
    Xanax: `CQADBAADvgEAAq8LYVGSTyL-wMKg0wI`,
    GoodHappening: `CQADBAADvwEAAq8LYVEXd5XiArZzJgI`,
    Revengemachine: ``,

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
                    { text: "آثار متنی", callback_data: "btn_storis" }
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
                    { text: "آثار متنی", callback_data: "btn_storis" }
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






    





var hadi = {
        DarYad: `در یاد
ساعتا وايسادن از حركت و بازي
تو نمي‌خواي عشق خامِتو ببازي

رو تنت پر شده از زخم و غبارِ
عشقی كه تشنه ی يك روز بهاره

من آسمون كشيدم رو سقف زرد خونه
تو مست و خسته اما از رقص اشك و گونه

تنم حريص و تشنه، بي‌تاب از بوی پاكِ
تنت كه غرق عطر رقص بارون رو خاكه

توی قلبم يه جهنم پر آدمای زشته
يه غرور زرد و كهنه مونده باقی از گذشته

بي تو تاريكيِ پر وهم خيالم
شده گورستان و آهنگ زوالم

تو چشات مونده هنوز جاي نگاهِ
هرزه چشمایی كه نورشون سياهه`,
      MaraMibini: `مرا می‌بینی
مرا می‌بینی و هر دم زیادت می‌کنی دردم
تو را می‌بینم و میلم زیادت می‌شود هر دم  

به سامانم نمی‌پرسی نمی‌دانم چه سر داری
به درمانم نمی‌کوشی نمی‌دانی مگر دردم 

نه راه است این که بگذاری مرا بر خاک و بگریزی
گذاری آر و بازم پرس تا خاک رهت گردم 

ندارم دستت از دامن بجز در خاک و آن دم هم
که بر خاکم روان گردی به گرد دامنت گردم 

فرورفت از غم عشقت دمم دم می‌دهی تا کی
دمار از من برآوردی نمی‌گویی برآوردم 

شبی دل را به تاریکی ز زلفت باز می‌جستم
رخت می‌دیدم و جامی هلالی باز می‌خوردم 

کشیدم در برت ناگاه و شد در تاب گیسویت
نهادم بر لبت لب را و جان و دل فدا کردم 

تو خوش می‌باش با حافظ برو گو خصم جان می‌ده
چو گرمی از تو می‌بینم چه باک از خصم دم سردم 
حافظ
`,
     Man: `من 
ه- هم آوازِ آهنگِ پایيز
آ- آلاله‌ها زرد، من شعرِ لبريز

د- دور از تو خون آلوده باور
ی- یاد شهرِ وحشت، یاد گلِ پرپر

پ- پا در زنجیر، قصه بی‌پایان
آ- آسمان از توست، سهمِ من زندان

ك- کهنه رويايي خالي از شورم
ز- زاده در آتش، زنده در گورم

آ- آلاله، برگرد از تبعید
د-ديوونه ی من، شب به كوچه تابيد1

مردابِ غم آگينِ تن بود
قلبي كه تنها سرزمينِ من بود

نفرین به این عشق، رویای آبی
آلوده میلی، دیرینه خوابی

من آغازي بر شعرِ شیطان
خون سرخِ توست مُهرِ اين  پیمان
`,
     Ashofte: `آشفته
آشفته‌تر از صدای باران
رنجيده‌تر از سوز بيابان
فرياد بزن تا شب زشتت
شايد كه رسد شبی به پايان

چون نقش زدن بر تن سايه
بر آنچه گذشت لعن و كنايه
بر باد اگر رفتم و رفتی
مغرور بمان و بی گلايه
 
آن لحظه دلم پر ز یقین است
کین قافله از شرم غمین است
"کان قافله دار بی نشانه"1
"معصوم تر از خاک زمین است"

محراب تو بود رنگ سپیدی
بتخانه ی شهر پر ز پلیدی
"تا یک بت پاک بر زمین بود"
"تو شکستنش به جان خریدی"

"دلداده بمان كه عشق پاك است"
"هر چند به سنگ كه جنس خاك است"
"هر چند به سنگ اشك حرام است"
"پايان شبم چه دردناك است"
`,
     Daghigheha : `دقيقه‌ها
دوباره دقيقه‌ها رو كند و آهسته مي‌بينم
دوباره چشم خدا رو رو خودم بسته مي‌بينم

تا دلم آروم بگيره  سر به كوچه‌ها می‌ذارم
رو به آدما می‌خندم، تو سياهیا می بارم

توی يك جاده ی برفی پيِ انتها می‌گردم
توی اين رويای آبی هنوزم اسير دردم

آخه دنيا تو چشام رنگشو باخته
آخه يك جنس غريبه آسمون منو ساخته

برده رنگ انتظارو بارون چشمای خسته‌م
انگار آهنگی نداره بی‌تو اين قلب شكسته‌م

عشق من جنس هوس نیست رنگ خاطرات تلخه
قصه های پر غباری که روشون چشمامو بستم

از سپيده تا سپيده آسمون ابری و تاره
مث بغض سينه‌ی من شوق باريدن نداره
 
بوي بارون مي‌ده حرفات، اشكِ چشمام بي‌قراره
عشق من سوز زمستون، عشق تو شور بهاره
`,
     GoleParpar : `گلِ پرپر
گل پرپر شده تو بادِ زمستون 
ريشه كرده توي سرزمین ويرون 

پُره از گرد و غبار ساقه و برگش 
سهم اون از آسمون برف و تگرگش

ای اسیر سایه‌های سرد و تاریک
می رسه ناله‌ی شب از دور و نزدیک 

آبيِ روياتو به سياهي نفروش 
من نمیذارم بشي اونجا فراموش 

آه اي گلِ تشنه من به آسمون رسيدم 
من نقشِ خدا رو روي ديوارا كشيدم

تا ريشه‌ی تو اسيره تو خاك 
آواي شبم مي‌مونه غمناك

هنوز از ریا سياهه آسمونِ شهر وحشت 
عمر عشق من تباهه از فریبِ زرد قدرت 

سرده اما تَنِ ساقه ديگه احساسي نداره 
ديگه سبزي نمي‌گيره اگه آسمون بباره
`,
     SafheyeAkhar: `صفحه ی آخر
می‌گذشت از نیمه شب ساعت و من باز 
سر گرفتم عادت دیرم از آغاز

می‌چکیدم روی کاغذ می‌نوشتم
بی تو بارون، من مثل خاک خشک و زشتم

تا نوشتم گل پرپر شد زمستون 
دوباره دقیقه‌ها شد کند و آروم
 
فصل رویاهای آبی هم سر اومد
از تو ای گل اگه حتی خبر اومد

ناگزیر از یاد تو باز پر گرفتم
بی رمق نفرین و ناله سر گرفتم

نفرین به این عشق رویای آبی 
آلوده میلی، دیرینه خوابی 

زرد و زشت و کهنه بودش سقف خونه
من یه آسمون کشیدم عاشقونه

من فراموش و تو خاموشی و در یاد 
من همون آهِ هوس که دادی بر باد 

ساعتا وایسادن از حرکت و بازی 
تو نمی‌خوای عشق خامتو ببازی
 
مست بارونی و رقص اشک و گونه
هوس بوی تنت مثل جنونه

ای بهار رفته از عمر تباهم 
من یه واژه زیر یک خط سیاهم

من ناگزیر و خاموش از پا نشسته بر خاک 
قفس به خود تنیده از کینه های ناپاک`
	,
		Adamahani : `آدم آهنی
فقط چند تا ترانه‌ست، كه می‌شنوی قبل خواب
بیدار میشی می‌بینی، نخورد تكون آب از آب

یك ساله می‌نویسم، بمون یه لحظه خاموش
ببند چشاتو آروم، از هر چی هست فراموش

تو، تو شهر ذهن منی، ذهن یک آدم آهنی
ذهنی پر از صفر و یک و ارقام باور كردنی

من از سیاره‌ی جنون، پناه بردم به این زمین
یاد گرفتم از آدما، ببین، ولی نگو، همین

رو این زمین خاكی هم حرف از بهشت دوباره بود
سطل زباله‌ها پر از نوشته‌های پاره بود

برای من بهشت یه جاست، زیرِ زمین، دور از همه
جایی كه قانونش منم، بی‌اعتراض، بی‌همهمه

واسه گریختن از زمین، فقط یک راه چاره بود
اون ورتر از دره‌ی مرگ، راهی به یک ستاره بود`,
		vasemanyavaseona: `واسه من یا واسه اونا
مادری بی قصد و چاره، بچه شو گذاشت سر راه
طفل بی زبونش داره میگه عقده هاشو با ماه

نیمی از زمین نا امن، از تو روشنه همه شب
گاهی صورتت هلاله، مثل پوزخند یک لب

ای كه روزا رو می خوابی، از تو مهتاب آسمونا
واسه كی داری می تابی؟ واسه من یا واسه اونا؟

توی هر قصه یكی هست، كه كتاب میشه به نامش
یه عده میان و میرن، تا بمونه قهرمانش

واسه من یا واسه اونا، می نویسی قصه هاتو؟
كدوم از ما اگه باشیم، می خرن نوشته هاتو؟

میگه حرفاشو با قلبش، پیر روزگار چشیده
قلبی كه یه عمره باطل، واسه این و اون تپیده

ای كه می‌تپی بی‌وقفه، توی كالبدِ تَن من
ای كه می‌كوبی به ظرف سینه‌یِ از آهن من

قلبكم می گذره از تو، همه رگ‌هام، همه خونا
واسه كی می‌تپی پس تو؟ واسه من یا واسه اونا؟
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
تو به اون ها بگو که من فقط یک نفرم!
اینکه پرواز نمی‌دونم دیگه شاهد نمی‌خواد!
غم که بوی خون گرفت هیچ‌کسی رو خوش نمیاد

اگه لحظه‌ها دارن از من مثل تو می‌گذرن 
اگه سکه‌ها دارن نوشته هامو می‌خرن
ای خدا من زنده‌ام در نیمه‌ی خاموش تو
با من از پاکی نگو من غرقه‌ام در نوش تو

من یه جمله‌م از یه قانون که تو هم شامل اونی
واژه‌های من نباشن تو نمی‌تونی بمونی

پس بگیر هر چی که دادی، پس می‌گیرم هر چی گفتم
من یه برگ خشکم اما با خود درخت می افتم 

بیش از این تکرار من فریاد سنگ از آهنه 
سنگ می‌دونه معنی دردو ولی نمی شکنه
`,
		Afaterisheh : `آفت ریشه
نبض من می زنه لاله 
بسه بی تابی و ناله
می پرم بی وزن و آروم
این نه مرگه، نه زواله
روی شونه های من باله
شبنم چشام زلاله
من صدات می زنم لاله
اون میگه همش خیاله
 
اون هم آغازه هم فرجام
عاری از جسم و تنه اون
من نه تصمیمم نه انجام
پآره برتر از منه اون

اون همون بنده و زنجیر
اون همون زندون شیشه‌س
اون همون مرگه و واگیر
اون همون آفت ریشه‌س

هرچی نور و شیء و وهمه
هر چی می‌گمو می‌فهمه

نه غروبه، نه سپیده
بوی دنیا رو نمیده


خالی از هر شور و حاله
هر یه لحظه قد ساله

من می‌خوام برگردم اما
اون میگه دیگه محاله

بس كن برو دیگه
گفتم تو رو دیگه ...

بس كن برو دیگه
گفتم تو رو دیگه ...
`,
		Zendegizirezamin : `زندگی زیر زمین
تا بپرم، پَر ندارم
شبم که آخر ندارم
تا بمونم، تاب ندارم
خسته‌م ولی خواب ندارم

بوی شیشه ی تَر میاد
صدای خاکستر میاد
برای من نفس بکش
هنوز این از تو بر میاد

گم شده آروم و راحت
واسه من زنجیر و بندی
بگذر از من مثلِ ساعت
که گذشت بیست سال و اندی

تو می‌خوای روی یه کاغذ
بنویسی خسته ای از
زندگی با یک دلِ تنگ
عاشقی کردن با یک سنگ

زندگی زیرِ زمین، گاه
طاقتم نیست بیش از این آه
پشتِ این عینکِ تیره
هردو زشتن خورشید و ماه



زندگی زیرِ ترانه
گفته های بی‌گَمانه
آنچه بر من رفته شعله
می‌کِشد از تو زبانه

تیکه تیکه شکسته‌هام
ببین می‌ریزن زیرِ پام
نگو خدا دوسَم داره
من دیگه هیچی نمی‌خوام

منو تو آغوشت نگیر
من دیگه آروم نمی‌شم
نگو خدا دوسَم داره
من دیگه هیچی نمی‌گم...
`,
		Zendaneshishei: `زندان شیشه‌ای
آه اگر گریه كنم، می‌شكنی از غم
تار و پود باورت، می‌پاشه از هم

وای اگر ناله كنم می‌سوزه خونه
جای آهم روی دیوارا می مونه

من فقط یك نفرم قد یه دنیا
 غم شده سهم من از زشتی و زیبا

توی یك زندون از شیشه
شبا می‌خشكونم ریشه

بباره سنگ از آسمون
می‌مونه اشك من پنهون

سینه پر خون شده از یك راز وحشی
دیده آزرده‌ام از هر نور و نقشی

هر نفس كه می‌گذره از قلب سینه
بوی غم می‌گیره و آهنگ كینه!
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
کافیه دیگه نمی‌خوام بمونم



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
                                     چیزی نیست.`,
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
 
تاریک، اما اهلی، مثل بوی نم خاک
تاریک، اما با هم، یک رقص تن به تن، پاک

تاریک، مثل هیچ چیز، بی همتا مثل مرگ
تاریک، اما افسوس، از افتادن هر برگ

تاریک، اما افسوس، تو نیستی در برم
تاریک، اما افسوس، از این بستر ترم

تاریک، اما تاریک...`,
		Book: `کتاب
تمومِ حرفایی که نگفتی
می‌خوان که زودتر از پا بیفتی
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
تمدن بومی‌های زود کوچ


خوش اومدی به تمدنِ مرگ
تمدنِ ساقه‌های بی برگ
 تمدنِ ترس، تمدنِ شَر
کهنه ترین اختراعِ بشر

خوش اومدی نوزادِ کتابی 
بیدار شو رَفیق، یه عُمره خوابی

وقتی قلبِ من و تو شب
روی نیمکتا می خوابن
وقتی ناگفته‌ها هر سال
شرطِ قیمتِ کتابن

وقتی با یک بغض پُر از حرف 
شب، کنارِ شب می خوابی
داره دیر می شه لعنتی
تو خودت یک جین کتابی`,
		Redline: `خط قرمز

با چشمای محکم بسته، رهام کردی توی این شهر
یک عمر عادتم دادی، به نوشیدن این زهر

پا فراتر گذاشتم از ممنوع خط قرمز تو
طمع نبستم هرگز اما، به بهشت هرگز تو

تو خشم گرفتی بر من، من طعم سخت چشیدم
تو جور نوشتی و من، مردانه جور کشیدم

چشم برنمی دارم از هر چی که گفتی زشته
پامو نذاشتم اونجا که می گفتی بهشته

اینجا سرزمینی است از رنگ آبى و هوای خنک
و رودخانه ای از نور تابناک در دو طرف خیابان

زیبایی اش در جريان...

کودکان با گونه های سرخ به خیابان می ریختند و رقص کنان گلبرگ هایی را زیر پای می پراکندند و دسته گل به گردن

پیکرهای آبى...

تو قصه می نوشتی و من، هر قصه رو صد بار می خوندم
تو چشمامو می بستی، من تو اون رویاها می موندم

برگه های آخر کتابو، می کندی و من می پرسیدم
می گفتی: مهم نبودن، آخرشو تو چشات می دیدم

تو یادم دادی که تو بودن، هرگز پایانی نداری
این خط تا وقتی قرمزه که پاتو اونورش نذاری`,
		MissYourFace : `دلم برای صورتت تنگ شده
دلم برای صورتت تنگ شده بوی نم میاد
هر طور زندگی می کنم بازم یه چیزی کم میاد

اگر به جای خاک خشک، روت آب تر ریخته بودن
می شد ببینی که چطور منو به هم ریخته بودن

دلم واسه بوی تنت تنگ شده، چشماتو ببند
هر جای آسمون هستی، به من فکر کن، به من بخند

بمون توی رویای من، یاد به فراموشی نده
من به شوق تو می‌خوابم، دنیامو خاموشی نده

من ناگزیر از بودنم، در شهر مردم واره‌ها
بر خاک تو زانو زدم، در خیل کاغذ پاره‌ها

آرام جانم طعمه شد، بر خوان عاشق خواره‌ها
آخر جنونم می کند، آواره از آواره‌ها`,
		GlassyGuard : `پیله‌های شیشه‌ای
تار و پود ریسیده ای از پیله های شیشه‌ای
حبس حجم پیله ای دور از حیات ریشه‌ای

من نفس کشیدم و آسون تو رو بردم زِ یاد
زندگی کن رو تن آشفته و ناامن باد

طعم شیشه، لب خونی، زهرتکرار
بوسه‌ها ازپشت شیشه، آه غمبار

با دروغ کهنه تا کی بوسه بازی؟
دل بکن از سهلیِ این راه هموار!

تار و پود ریسیده‌ای از پیله های شیشه‌ای
مسخ حجم پیله‌ای دور از حیات ریشه‌ای

من به تصویر تو از پشت شیشه خیره و مست
بی‌توجه به به جز صورت تو هرچی که هست 

آن قدر بوسیدمت در رویا از سوی دور
خانه ی تاریک رویا روشن است از بوی نور

از بهشت زیر زمین تا زندگیِ گیشه ای
درد مشترک تویی تو پیله های شیشه ای
 
تو تنها شعر من هستی که از زشتی تهی هستی
تو تنها قطره ای هستی، که دریایی

من آن بادم که می تازم، به هر سویی به هر سویی
تو تنها قطره ای هستی، که می نوشم`,
		OrdinaryPerson : `آدم معمولی
می خوای چی یاد من بدی، مگر تجربه پولیه؟
کجا تجربه می فروشن، کجای این کار اصولیه؟

یه طور حرف می زنی انگار زندگی چارتا قانونه 
هر کی کلاس تو رو بیاد زندگی واسه ش آسونه

آدم معمولی بس کن تو هیچی بیشتر نمی دونی
هر چی تو این کلاسا میگی، جز تو کتابا نمی خونی

آدم معمولی بس کن با نگاهت نزن طعنه
نه من عروسک قصه م، نه این فیلمه نه این صحنه



اگر ازت بپرسن که چرا جات اون بالا ها نیست؟
می گی انتخاب خودمه، بهتر از اینجا هیچ جا نیست

اسم خودتو گذاشتی مَستر قرعه به نامت اینطوری افتاد
اگر زندگی درس آدماس تو چه کاره ای؟ بی خیال استاد

آدم معمولی صبر کن، شروع نکن به درس دادن
یه بار اونارو بخون، چند جمله از قلم افتادن

آدم معمولی بس کن با نگاهت نزن طعنه
نه من عروسک قصه م، نه این فیلمه نه این صحنه`,
		Doctor: `دکتر
دکتر دیشب دوباره، مریض خوبی شدم 
همه قرصا رو خوردم، یک آدم چوبی شدم

دکتر چرا عروسک، غمگین نمیشه گاهی؟
دکتر دارویی بده، دکتر بگو یه راهی 

دکتر دیشب تب کردم، انگار چیزایی گفتم
صبح یکی ازم پرسید، چی اومد سر جفتم؟

فکر می‌کنم از کشتی به آب افتاده باشم
حس می کنم رو تنِ نهنگ ایستاده باشم

فکر می کنم به بویِ دریا خو کرده باشم
تو شکم نهنگ، مرگ، آرزو کرده باشم

فکر می کنم چیزی رو از یاد برده باشم
حس می کنم یه جایی، یه روزی مرده باشم

دکتر منو از اینجا ببر
بیا این پول زندگیمو بخر
دکتر ماهیا نمیدونن، 
من ماهی نیستم نمی تونم

دکتر این نسخه‌ای که دادیه
دکتر نگو همه چیز عادیه


دکتر بگو چه م شده، چرا ذهنم خالیه؟
هیچ احساسی ندارم، نگو اینکه عالیه!`
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

منِ منفوری که هر جا، به همه حس بد دادم
 جبر خلقتم همینه، من یه اشتباهِ ساده م

من و زندانبانِ گریه، من و حسرت های پروین
 مرگِ من روزی فرا خواهد رسید، روزی پس از این

منِ لعنتی همینم، جوهر تلخ روی دیوار 
من رسالتم همینه، واسه این شهر، شعر آزار

من و افلاطونِ بی رحم، من و سستی های بیزار 
شهر و آرامش مزمن، من و کوشش های بیمار 

منِ لعنتی نمی خوام، اتفاقِ ساده باشم
نه به قیمتِ خوب بودن به نبود افتاده باشم
`,
		WhatAboutMe : `پس من چی؟
می دونم وقتِ تو رسیده، پس وقتِ من چی میشه؟
می دونم پاهای تو خسته ن، پاهای من چی میشه؟

می فهمم چشمات غم دارن، چشمای من چی میشه؟
می بینم غمگینی، اما غم های من چی میشه؟

می دونم خسته ای‌اما خستگی من چی میشه؟
باید زندگی کنی‌اما زندگی من چی میشه؟

حرکت نکن، اینجا درست همونجاست که باید باشی
بغض نکن، درست همون لحظه باید از جا پاشی

نفس نکش، همین الان همه از تو هوا می خوان
پلک نزن، اینجا همه فقط از تو نگاه می خوان

تو انتظار کشیدی، پس صبر من چی میشه؟
می فهمم مجبوری‌اما پس جبر من چی میشه؟

می دونم که تو همینی، پس خودِ من چی میشه؟
تکلیفِ اون خودِ تویی که شده من، چی میشه؟

می دونم آرزوت این بود، آرزوی من چی میشه؟
می فهمم حقِ تو همینه، پس سهم من چی میشه؟

پس عمر من چی میشه؟ می دونم واسه تو زوده
پس سهمِ من چی میشه؟ پس سهمِ من چی میشه؟

می بینم راهِ تو جدا شد، پس راهِ من چی میشه؟
مهتابِ شبت برگشت، پس ماهِ من چی میشه؟

می دونم فصل تو رسیده، پس فصلِ من چی می شه؟
می فهمم سبزِ من گذشته، پس نسل من چی میشه؟
`,
		DeathAngle : `فرشته مرگ
بیا آروم منو از گودال بالای این پیکر بکش بیرون، 
ببر بالا
ببر جایی که هیچ چیزی نمی مونه, 
برای حتی یه لحظه 
ببر جایی
 به دنیایی که هر چیزی یه تصویره
 یه رویا یا...

بیا آروم, طوری که هیچکی نفهمه
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
فقط یه بییننده می خوان`,
		YouDidntHaveTo : `لازم نبود
تو مثل من نبودی، کارای سخت نکردی
جاهای دور نرفتی، چیزای بد ندیدی 

تنت بارون نخورده، قهرمانت نمرده 
شبونه بدمستی باد هستیتو نبرده
 
معشوقه ی خیالی به آغوش نکشیدی 
با چشم بسته هر شب خیالو نبوسیدی
خون و اشک و شرابو، تو با هم نچشیدی

لازم نشد برگردی، لازم نبود برگردی
که ثابت کنی مردی 
لازم نشد بمونی، لازم نبود بمونی
ثابت کنی می تونی 
لازم نشد بمیری، تا انتقام بگیری

تو می کشی هر شب منو توی ذهنت به حال بد 
تصویر من تو رویاهات تبدیل شده به یک جسد 

تو می کشیم، فقط چون من هم مثل تو یه آدمم 
به میوه ی ممنوعه ی درخته باغت دست زدم

تو مثل من نبودی، کارای سخت نکردی
جاهای دور نرفتی، چیزای بد ندیدی 

تنت بارون نخورده، قهرمانت نمرده 
شبونه بدمستی باد هستیتو نبرده
 
معشوقه ی خیالی به آغوش نکشیدی 
با چشم بسته هر شب خیالو نبوسیدی

خون و اشک و شرابو، تو با هم نچشیدی
چندتا قرص با یه بغضو، تو با هم نبلعیدی
زنده زنده تو گور باورهات نپوسیدی`,
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
زمین با من حرف…`,
		Chess: `شطرنج
سیزده ساله که بودم کسی رو نمی شناختم
که تو بازی شطرنج، شاید بهش می باختم

فکر می کردم نابغه م، حس می کردم یه مردم
هر بار که با نقشه ای، کسی رو مات می کردم

شنیده بودم شطرنج رو کامپیوترها هست
با خودم گفتم چرا حریفو بدم از دست؟

وقتی که اولین بار به یک رایانه باختم
مهره ها رو برای همیشه دور انداختم

حتی اگر اون دستگاه بازی رو به من می باخت
مدتی بعد یک شرکت، نسل برتری می ساخت

یاد گرفتم همیشه موجودی باهوش تر هست
حتی وقتی از قدرت، بی اندازه شدی مست

درست وقتی تو بازی، یه جای خوب نشستی
یه بازی بزرگتر هست که تو جزوش هستی

اینجا جایی برای از خود راضی شدن نیست
بازی کردن جز دامی واسه بازی شدن نیست`,
		FascinatingFlower : `گل دلفریب
گل دل فریب سرخ باغ من، پس بوی گلبرگ تو کو
عشق من چیزی بگو، قلبی بسوز، چشم به من خسته بدوز

تا نسیم سرد شب از ساقه ی تو می وزه به صورتم
من هنوز دیوونه تم، بی من نمیر، عشق من پاییز نگیر

گاهی از دوری من، آهی سر کن گل من
گاهی بیدار بمون تا صبح با خیال من

گاهی از دوری من، دلتنگی کن مث من
با عطر خوش نفست، شعری بگو واسه من

گل دل فریب سرخ باغ من، پس بوی گلبرگ تو کو
عشق من چیزی بگو، قلبی بسوز، چشم به من خسته بدوز

شبنم زلال چشمه ی چشت، گونه های پر خواهشت
واسه من آرامشه، بارون نبار، عشق من تنهام نذار

کودکی کردیم من و تو، توی باغ کهنه و پیر
تازگی نداره این فصل، فصل پاییز فراگیر

نه درخت، نه برگ، نه ریشه، شیفته ی سنگ و همیشه
گل دل فریب من تاب، نه به قانون همیشه

گل دل فریب سرخ باغ من، پس بوی گلبرگ تو کو
عشق من چیزی بگو، قلبی بسوز، چشم به من خسته بدوز

به جنون کشیده قحطی نفس از رنج موندن تو قفس
زنگ دل فریب خنده‌های تو، میوه ی رسیده نو

گاهی از دوری من، آهی سر کن گل من
گاهی بیدار بمون تا صبح با خیال من

گاهی از دوری من، دلتنگی کن مثل من
با عطر خوش نفست، شعری بگو واسه من

دل هیچ کسی برای باغ ما هرگز نمی سوزه گلم
بند تنهایی من بی بوی تو هرگز نمی پوسه گلم

تا نسیم سرد شب از ساقه ی تو می وزه به صورتم
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
یکی از سوالا رو بپرس از خودت، سپهر`
	,
		TheGun : `اسلحه
مثل سگ تو رختخواب تمرین مردن می کنی
مثل هابیل سعی بر از یاد بردن می کنی

مجرم سقط شعور بیچاره ای از کمترین
سوزن از تو نعشه تر، خونت از سم سم ترین

فرق روز افزون تن ها 
وحش پر فحشای من ها
مرد بی اقبال پیروز
حزن بی مقدار زن ها

مثل سگ در انتظاری
تا وفاداری کنی 
مثل قابیل بی قراری 
تا عزاداری کنی 

یادت نره اسلحه
هنوز تو دست منه
هرچند هم آرومم
اما نبضم می زنه

باید ورق برگرده
من همین جام عزیزم
من مدیون شانس نیستم
از دور شعر نمی ریزم

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
هر حیوونی رو دیدم اسلحه رو دوست داره`,
		MissMyself : `دلم برای خودم تنگه
نیمی از یک مترسک با نیمی از یک بدن
با هم پیوند خوردهَ ن تا پیکرِ من شُدن

کلاغا هر روز از نیمی از من می ترسَن
و لاشخورها، شب روی نیمِ دیگه می رقصَن

سالهاست من حامی گندم های تو بودم
به زندگی برای تو خو کرده وجودم

تو از کلبۀ اون دور، هر صبح با لبخندی
و پیش از خواب هر شب پنجره رو می بندی

و من با شیاطین تا صبح می جنگیدم
و هر بار پیش از صبح بغضم را می بلعیدم

و تو درست به کسی زندگیتو مدیونی
که مدت هاست از اون هیچ چیزی نمی دونی

سال هاست زندانی آزادی تو هستم
قهرمان و قربانی، از این دو واژه خستم

سالهاست پوست گرمی رو با شوق نبوسیدم
مدت هاست که توی آب صورتمُ ندیدم

دلم برای تو، برای تو از نزدیک
تنگه برای نفس، تو یه گوشه ی تاریک

دلم برای اشک، دلم برای خواب
دلم برای سیب، دلم برای آب

دلم برای زن، دلم برای تن
دلم برای من، دلم برای من

دلم بیش از هر چیزی برای خودم تنگه
و من برای خودم، دلم چقدر تنگه

و من سال هاست برای خودم دلم تنگه
و من چقدر برای خودم دلم تنگه`,
		WhatDoesItMean : `یعنی چه؟
ناگهان پرده برانداخته ای یعنی چه؟
مست از خانه برون تاخته ای یعنی چه؟

زلف در درست صبا گوش به فرمان رقیب
اینچنین با همه در ساخته ای یعنی چه؟

شاه خوبانی و منظور گدایان شده ای
قدر این مرتبه نشناخته ای یعنی چه؟

نه سر زلف خود اول تو به دستم دادی
بازم از پای درانداخته ای یعنی چه

زلف در درست صبا گوش به فرمان رقیب
اینچنین با همه در ساخته ای یعنی چه؟

سخنت رمز دهان گفت و کمر سر میان
و از میان تیغ به ما آخته‌ای یعنی چه؟

زلف در درست صبا گوش به فرمان رقیب
اینچنین با همه در ساخته ای یعنی چه؟

هر کس از مهره مهر تو به نقشی مشغول
عاقبت با همه کج باخته‌ای یعنی چه؟
 حافظ`,
		ColdAngel : `فرشته سرد
عطر گرم، پوست نرم، لب سرخ، لحن سرد
حس شرم، طعم یخ منو دیوونه می کرد

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
به اعماق درونم

اگرچه باور کردم
تو دیگه زنده نیستی
تو هر نگاه سردی
مقابلم می ایستی

فرشته سرد من
برای من حرف بزن
برای صورت من
نوازش گرم بتن`,
		Postman: `پستچی
من فقط یک پستچی بودم و نه بیشتر
تو فقط یک نامه بودی و نه کمتر

انتخاب من فقط رسوندنت بود
مال من نبودی، پس رسوندمت زود

تو همراه من بودی، نه مال من
تو اجبار من بودی، نه بال من

گرچه باید بسته می موند پاکت تو
منو ببخش که بردم راحت تو

غمی بزرگتر از این برای این من مست
که مال من نباشی، درحالی که دلت هست

تو ببخش که مست شدم از بوی جوهر
من یک کاغذ خوار ساده ام نه بیشتر

به گناه میل دارم و صد ها برگه
واسه این پستچی خوب وسوسه مرگه

گرچه من پستچی خوبی نموندم
تو هستی چون من تو رو سالم رسوندم

این چقدر سخته که یک پستچی باشی
و خودت صاحب نامه‌ای نباشی`,
		And: `و
تو خیلی باهوشی، همه چیز می دونی
آب زیرت نمی ره، تو جا نمی مونی

هرگز نمی ترسی، رفتارت سنگیه
غافلگیر نمی شی، نگاهات خشمگینه

تو خیلی خونسردی تو جمع ها می خندی
هرچیزی رو قبلا تو پیش بینی کردی

و البته تو واقعیتی
اما تو فقط قسمتی از حقیقتی
و تو می دونی همه درس
و از چیزایی که نمی دونی بترس

تو خیلی مرموزی، سخت می شه فهمیدت
و خیلی دور از دسترس و کمتر می شه دیدت

و تو خیلی ویژه ای و اشتباه نداری
و همه چیز در تو هست و تو شانس نمیاری`,
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
تو هر صبح در من بعد از، بیداری ظاهری
به شکل درد حس میشی، جایی اطراف مری
یه جایی توی مغزم، به دیوارا می کوبی
جایی که نمی رسه، دست هیچ قرص خوبی

تا من به خواب برم با، شیمی مصنوعی

تو یه حفره تو سرم، کالبدی از تو مونده
اعتیاد ذهنی به عاطفه ی آلوده
گاهی که لبریز از تو، به ارتفاع آغشتم
و نم لیز می خوره از، منحنی های چشمم

که روی آب بریزه، چیزایی که نوشتم

تو یه حفره تو سرم، کالبدی از تو مونده
اعتیاد ذهنی به، عاطفه ی آلوده
تئوری محزون انتخاب سراب از
چیزی شبیه خونو می نویسم رو کاغذ

تا من به فاک برم با شیمی مصنوعی

از دیوار شنی گودال قلب ناتنی تو
هر روز بالا میرم و میرم و سر می خورم به زیر
اضافه ی روح عادتی پیوند لعنتی رو بگیر
شوق ترکیب لذت با تو و دیدن واکنش

که روی آب بریزه، چیزایی که نوشتم
تا من به خواب برم با، شیمی مصنوعی`,
		CommunicationWithTheDeaf: `ارتباط با کرها
کنار بطری ها برای نوشیدن
کنار کلی ها برای رقصیدن

کنار بدن ها برای خوابیدن
کنار وحشی ها در حال جنگیدن

شش هزار و چهارصد قرن برای فهمیدن
خروج از این چرخه بجای پوسیدن

من عضو نا مطلوب برای این دستگاه
خطای تکنیکی تو آزمایشگاه

در حال حرف زدن برای دیوارها
برای درک شدن، برگشتن به غارها

شهرها لبریز از مردها و زنها
کنار انسانها من چه فکرم تنها

در حال کوبیدن به تمام درها
دست بردن به فکرها، ارتباط با کرها

تقاطع خسته از آمد و رفتنها
تو ترافیک آدم، فکر من چه تنها

کنار احمقها برای خندیدن
کنار تو حتی برای رنجیدن

من عضو نامطلوب برای این دستگاه
خطای تکنیکی تو آزمایشگاه

در حال حرف زدن برای دیوارها
برای درک شدن، برگشتن به غارها

شهرها لبریز از مردها و زنها
کنار انسانها من چه فکرم تنها

در حال کوبیدن به تمام درها
دست بردن به فکرها، ارتباط با کرها

تقاطع خسته از آمد و رفتنها
تو ترافیک آدم، فکر من چه تنها`,
		YellowHarmony: `موسیقی زرد
به صدای من گوش نکن موسیقی زرد داره
به قلب من دست نزن بیماری سرد داره

به روح من نزدیک نشو که سال هاست طرد شده
به مغز من دست نزن سرایتِ درد شده

و از همون دور به من حسِ ماورایی بده
از موجودی که جون داره به من یک تداعی بده

و مثل نقاشی به من خو کن از مجرای نگاه
که من حرکت نمی تونم از چارچوب قابِ سیاه

تو باش ولی موازی باش، همراه ولی لمسم نکن
میل به ترکیب یا واکنش، یا هرچی می ترسم نکن

پی‌ام نگرد که گُم میشم، با من نخواب که کم میشم
ترکم نکن که می میرم، بسامدهای بَم میشم

به سایه ی من دست نزن، که طیفی از هوس داره
طبیعتِ بی تابِ من، انقطاعِ نفس داره

به عطر من دست نزن، که تو سینه ت قفس داره
که اِستِنشاق بوی تو، اتصالِ عبث داره`,
		ButtonOfDoom: `کلید انفجار
با طناب های واهی دلتنگی گاه گاهی تو نجات پیدا می کنم و زیر آب میرم
تو چاله های فضایی تصویر انتزاعی صورتت، هر روز به دام میفتم و به خواب میرم

از ارتفاع تخمینی روح ورا زمینی تو، هر بار وحشت می کنم و سقوط می کنم
از شلوغی موسمی دوران نو بلوغی تو، از دل تا لب می رسم و سکوت می کنم

ازینکه تو آزمایشگاه دکتر منو زیر میکروسکوپ آزمایش انتهایی قرار میده
بعد از گزارش نتیجه به رییس، با دستور اون کلید انفجار آزمایشگاهو فشار میده

از گردبادی که ساختی و طوفانی که راه انداختی، تو خشک خشک می شکنی و من تر خم میشم
از تهوع افتادن و میل به پس دادن میوه های سمی تو می میری و من کم می شم

با اینکه می بینم تو هم تو کانون توجهم به ریشه های درخت می خندی درک می کنم تو رو
از آبشار زمان و محدوده ی‌امکان و این جهان، پا بیرون می ذارم و ترک می کنم تو رو`,
		UnderneathTheOcean: `اقیانوس انزوا
به زندگی زیر اقیانوس انزوا
به خوابیدن تو عمق آبی تیره ی دریا

به آرامش بیشتر از هوا محتاجم، همین
تو روی آب برقص و دنیا رو بیشتر ببین

من از سرب های تنم سبک می کنم تو رو
من از خواب زیر آب بیدار نمی شم برو

ای شبح تکراری که دست بر نمی داری
برو باید فکر کنم تو وضع اضطراری

به پیرامون خلوت، سوت سکوت ممتد
به سکون عاطفی، توقف جزر و مد

به بی وزنی بیشتر از جاذبه نیاز دارم
به پرواز روی دره، اشتهای باز دارم

به تنهاییم توی جمع، به ازدحام فردی
به ارتفاع روحم، که دست پیدا نکردی

خاک مرغوب کشت هویت های بیمار
پا از قلمروی قلب، دست از ذهنم بردار`,
		People: `مردم
مردم اجزا روحمو، ارزون به تاراج می برن
تو آخرین سال دنیا، به روز خوشبختی می خرن

فقط تماشا می کنم انگار برام هیچ مهم نیست
به تدریج تبدیل شدم به یک بیمار پست مدرنیست

حس چیزایی که می گم، تو هیچ جای صورتم نیست
حتی افکارم شبیهِ فریم هایِ حرکتم نیست

تاثر مردمو با سر تایید می کنم
واکنش عاطفیِ اونها رو تقلید می کنم

به باغ وحشِ باورم صبح ها گوشت خام می برم
برای برگشتن به شهر اسلحه و دام می خرم

مردم در پی توسعه و من افول می کنم
مردم چیزای، بد می خوان و من قبول می کنم

تو رو اضافه می کنن به جشن قهرمانانه
شب ها تو رو خط می‌زنن از لیست های محرمانه

مردم نبوغ می خرن و احتکار می کنن
با ایده های تو ولی مردم چه کار می کنن

برای منِ خوب از دور، هورا چه راحت می کشن
مردم تو رو نزدیک می‌خوان تا به کثافت بکشن

مردم تحمیل می کنن، هوا نیاز فوری نیست
مردم توجیه می کنن و می گن اینکه طوری نیست

برای منِ خوب از دور،هورا چه راحت می کشن
مردم تو رو نزدیک می خوان تا به کثافت بکشن

مردم برای خودکشی، یک ابتکار می کنن
با پیشگیری از زندگی، مردم چه کار می‌کنن؟
`,
		FreeSpirit: `روح آزاد
یک شب سرد، تو خیابون، تو دستات کا میکنی
خودتو مقابل دو چشم پیدا میکنی

با نگاهت حس مرموزی رو القا میکنی
وجودت به وجد میاد، اما حاشا میکنی

عشق من تو هر روز، فرم به فرم در تغییر
از همه نسیم و طوفان تحت تاثیر

من همونم که تورو اینطور ترسیم کردم
قلب آزردتو تو آغوشم ترمیم کردم

کسی که زخمهای روحتو جراحی کرد
شب و روز بی وقفه افکارت طراحی کرد

قلبمو مشغول جمله های سادت کردم
و به سختی به وجود سادت عادت کردم

تورو بی‌نیاز از آرزوی واهی کردم
من تورو به دنیای واقعی راهی کردم

حس خنثی‌ای که تو روح آزادت هست
همه چیزی که از من هنوز توی یادت هست

درونم حس میکنم جوشش موهومی
لحظه هایی از دور که تو نا آرومی
دشمن زیبایی از عصاره‌ی خودم
با فراموش کردن تو از خودم محو شدم

تو ازم دور شدی و من بی‌تاب شدم
روز تحمل کردم شبها بی‌خواب شدم

من کمی وقت میخوام، تا ازت سرد بشم
شبیه دنیایی که لهم کرد بشم
`,
		NaturesGuilt: `گناه طبیعت
داره مردمک ِچشمِ زیبات گشاد می شه
داره جریانِ خون توی مغزت زیاد می شه

صحنه‌هایی که دیدی رو باور نداری
گریزی از حقیقتِ زجر آور نداری

تو اتاقت مشغولِ قتلِ عامِ انفرادی
اینکه پیغاماتو سیزده روز جواب ندادی

می‌خوای تمامِ بافت های حافظه تو از دست بدی
می‌خوای تجربه ی مسمومتو به دنیا پس بدی

با احساسِ یک حیوونِ زخمی سمتِ آب میری
داری زخماتو لیس می زنی و آروم به خواب میری

صُبح تو جنگل بیدار می شی و اسمتو یادت نیست
به جز بوی انتقام تو زمینِ آزادت نیست

توی آرواره هات حس می کنی دردِ زیادی
یعنی تو خواب دندوناتو رو هم فشار می دادی

اینکه هندسه‌ی صورتت شبیه به حیوونا نیست
یعنی تو نسلی هستی که انتخابِ اونا نیست

اینکه هر جا میری اون صحنه ها رو هم می بری
یعنی مثلِ گرگ آدمای بی‌گناهو می دَری

اینکه تو محصولِ کشتِ انسان تو باغِ وحشی
یعنی تو گناهِ طبیعتو هرگز نمی بخشی

اینکه رفتارِ مردم شبیه به اینکه می خوانت نیست
یعنی ذره ی زنده ای تو طبیعت نگرانت نیست

اینکه تو فَکِت حس می کنی دردِ زیادی
یعنی دندوناتو تو خواب رو هم فشار می دادی

اینکه تو نوزادِ درنده ی همین فصلی
اینکه حلقه ی بعدی زنجیره ی تولیدِ نسلی`
	,
		FinalRun: `فرار آخر
تو فرار آخرم از یخبندان های تو
به قتل می‌رسم به دست مرزبان های تو

مارپیچ و متروک، همه اتوبان های تو
شهرها به ترتیبِ سفیدِ دندان های تو

راننده های بی هدف با قلب های مُنفعل
بین این همه جسد، من بُحرانِ مستقل

تونل های خاطره همه منتهی به تو
رو پل های حافظه من تحت تعقیب تو

روزهای اول به نجات امید می‌ورزی
هفته‌ها پس از فرار مثلِ بید می‌لرزی

نورهای شناسایی از فانوس های تو
ابرهای تیره پوش که جاسوس های تو

جاده ها همه مسدود از بهمن های تو 
نا امن از توهم ها این راهزن های تو

من چکار می کنم سال ها بدونِ تو
جز فرار نافرجام از طاعون تو`,
		ONegative: `او منفی
اشتباهی که با صبر داره تغییر نمی‌کنه
انتقامی که سال هاست خشمتو سیر نمی‌کنه

هیچ کس مثل تو منو زیبا گمراه نمی‌کنه
هیچکس مثل من به این دقت گناه نمی‌کنه

نفرتِ چشم های تو میلمو کم نمی‌کنه
شاهدِ لالِ قلبِ من هم تبرئه م نمی‌کنه

ماشینِ دروغ سنج هم به من کمک نمی‌کنه
حسم از قلبِ من عبور به مردمک نمی‌کنه

این مرز که نیازمو به رفتن درک نمی‌کنه
میل به سکونِ چسبناکی که منو ترک نمی‌کنه

انتظاری که هیچ مُنجی اجابت نمی‌کنه
اسراری از تو که سنگ هم امانت نمی‌کنه

تنهاییِ بی وصفِ خونِ اُ منفیِ تو
بدرقه ی غمناکِ مامورهای مخفیِ تو

احتیاطِ رد شدن از باتلاقِ دلتنگیِ تو
از همه چیز گذشتن تو منطقه ی جنگیِ تو

آتشفشانِ وهمِ من استراحت نمی‌کنه 
ارتفاعِ متروکی که عُقاب طاقت نمی‌کنه

تلاطمِ هولناکی که قبلا تو کتاب خوندم
هفته ها روی موج های سطحیِ خواب موندم`,
		Eavesdrop: `شنود
		...`,
		Juggle: `فرارِ مردمَک ها از چشم تو چشم شدن ها 
دنبال کردن پاها، لب ها و بدن ها

توی این سالنِ شلوغ و نبودن در امنیت 
گوشه گیری از جنسیتِ بودن در اقلیت

سَندروم بیقراری پا به اطراف
یعنی تو خسته ای از مَرد حرّاف

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

بی‌اعتناست نگاهت به ژِن‌های کِشت من
به چشم تو نمیاد جوجه اردک زشتِ من`,
		PackedLife: `زندگی بسته‌ای
از بسته‌ی رَحِم تا جعبه‌ای به نامِ گور
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
		HazeToCelerity: `مه تا وضوح
با پوست صورتم بگم، به بالش کرم بگم 
با مورس های مردمک، از جعبه ی سرم بگم

از هسته ی غمم بگم، با زبون تنم بگم
به انعکاس صورتم، رو شیشه ی ترم بگم 

به شیشه ی ترم بگم، با بالهای روح برم 
به مرز ابر و کوه برم، از راه تودرتو برم 

از مه تا وضوح برم

به جای دوری کوچ کنم، برم تورو از دست بدم 
یک شهر طراحی کنم، به آغوش تو بسط بدم 

به خواب طولانی برم، با ذهن کیهانی برم 
فقط با یک آرزو، به دشت مرجانی برم 

برم یه غار ساده رو، جایی شگفت انگیز کنم
دروغ های زیبامو، هر صبح تمیز کنم 

یه سنگو پشت آبشاری، پر از گیاه هرز کنم 
یه تخت نرم بسازمو تورو کنارم فرض کنم`,
		Verticalcemetry: `گورستان ایستاده
وحشت بی‌دلیل من از روزهای فرد 
نرم افزار عاطفه، کد های لذت و درد 

شغل طاقت فرسای سرگرم کردن تو 
خستگی‌ی جونکاه کار تو معدن تو 

گورستان ایستاده، زنده های معمولی 
میلیاردها سال برای بلوغ تک سلولی 

غرور غم انگیز تنهایی تو ارتفاع
سبک کردن بغض تو سرویس هواپیما 

سرم  سردر شهرها، شوشتر تا بلخ تو 
قربانی درک فلسفه ی تلخ تو 

انقراض مرموز نهنگ های آبی
پیشنهاد طبیعت به مرگ اکتسابی
 
باز معلق شدم تو قرن های اشتباه 
از انسان بدوی، تا توربین های گناه 

این سطح از درد برای پوست نازک یک روح 
برای پیر شدن تو یکروز از عمر یک نوح`,
		TheOneILovedToBe: `کسی که دوست داشتم باشم
تو تخت تنت یک روبات مچالست 
دستهات منطبق بین کشالست 

اون سایه اومده واسه ملاقات
اما نه برای گوش دادن به حرفات 

اون اینجاست با زنجیر برای دستهات 
اون اومده با یک لیست از شکست هات 

اون امیدهای مردست از خود تو
اون آرزوی سوختست که شده تو

پوستم نمیپوشونتم 
چشمم نمیخوابونتم 
کسی که میخواستم باشم
آروم نمیذارتم 

از آرشیو بیرون میکشتم 
و دستگاه باز میخونتم 
کنار تو میذارتم
به حرف وا میداراتم

کسی که دوست داشتی باشم 
به تو بر نمی‌گردونتم

یه خبر تو راهه، نه به این بی رحمی 
همه چیز خوب میشه، اینو زود میفهمی`,
		WhereIamFrom: `من کجایی‌ام
زل میزنی به ابزار بینایی‌ام 
میپرسی از من، که کجایی‌ام 

مخترع عاطفه پلاستیکی‌ام 
مبتکر جملات مکانیکی‌ام 

من سرعت مغزهای شیمیایی‌ام 
من نیاز به دانش مومیایی‌ام 

لذت کشفهای ماورایی‌ام 
من انزال های غم در تنهایی‌ام 

من شاعر قرن های جدایی‌ام 
من ساکن شهر های انتزاعی‌ام 

حمله ی هورمون های ارگاسم زایی‌ام 
من حاوی ی متون پر تداعی‌ام 

دنیایی که چشم هاتو میبندی‌ام 
من دلیل ترس از بلندی‌ام 

من دقت ریزایده ال خواهی‌ام 
من وسواس نگاه پادشاهی‌ام 

من تنهایی بی وصف در اقلیتم 
من لذت های عشق در امنیتم 

قهرمان زندگی های موازی‌ام 
من دستگاه این نوع شبیه سازی‌ام`
	,

		Sib: ``,
		Hanozam: ``,
		DesertRose: ``,
		GreenRobans: `ربان سبز
ای سیب سبز از بهشت، قاصد نور از سحر
از دور به تو خیره ایم، از دور با چشمان تر

از بین مه و خلاء، با آهنگ تند نبض
بیقرار بوی نو، بیتاب یک سیب سبز

حرف بزن حرفی ای سیب، از حنجره های ما
 باغ سبز نشان بده، از پنجره های ما

 ای سیب سبز از بهشت قاصد نور از سحر 
از دور به تو خیره ایم از دور با چشمان تر

گلبرگ سرخ های ما که بر زمین باریدند
برگیر و تیمار کن که از تگرگ رنجیدند

ببین هزاران و یک روبان سبز زنجیرند
تا پر غرور بر قله در آغوشت بگیرند

هی سیب سبز از بهشت ای قاصد بوی مشک 
از دور می خوانیمت از دور با لب های خشک

تو نیستی یک تن ببین هزاران و یک نفر
کانون قلب های سبز یک فکر یک چشم تر


ای سیب سبز از بهشت قاصد بوی شبنم
امروز می خوانیمت امروز با دلهای غم 

در چشمانت لبخندی از پیر مهربانی 
بر لبخندت آهنگی، آوای آسمانی

سردار تشنگان را نام خوش بر توست زین بین
ذکرهایش همراه توست قهرمانی چون حسین`,
		NothingWillGetBetter: `هیج چیزی بهتر نمیشه
یکی مثل تو که میره، یکی مثل من می‌میره
یکی شکل خدا، هر چی داده یهو پس می‌گیره

هوا روشن میشه ولی چرا دلت هنوز شبه
و زندگیت توی گلوت، هر روز نزدیکتر به لبه ِ

بدت میاد از باورت، هوای مرگ توی سرت
می خوای تموم بشی مثل آرزوهای پرپرت

یکی مثل تو نمیاد گرم کنه این تن سردو
اما من هر روز زنده تر که بیشتر حس کنم دردو

تو پارۀ قلبمی که خون ازت میگذره
تو رو ازم بگیرن، راحتــمو میبَره

تو گوشه های لبی که با تو میشه خندید
تو رو ازم بگیرن، احساسمو میشه دید

یکی مثل تو نمیاد و هیچ چیز بهتر نمیشه
روزهای سختی میگذره، باقی مونده هنوز ریشه

کسی جاتو نمی گیره، هیچ چیز آروم تر نمیشه
که یک حس وحشی میگه هیچ چیزی بهتر نمیشه

تا یک فرشته میرسه بعد از سالهای دراز
و گوشه های لب تو دور از هم و بخنده باز
ببین آفتاب هنوز گرمه، نورش هیچ کمتر نشده
اما خوب که فکر می کنی، هیچ چیز هیچ بهتر نشده

تو تسکین یه دردی که سالهاست با منه
تو رو ازم بگیـــرن، بنیانمو میکَنه

تو قسمتی از چشمی، که خواب با تو ممکنه
تو رو ازم بگیرن، تا صبح پلک نمیزنه

مهر1389`,
		BlackRose: `رز مشکی
جسد یک رز مشکی-همه چیزی که از تو دارم
بعدازظهرهای غمگینم که از تنهایی بیزارم

و توهم هایی کوتاه که نشستی تو کنارم
مه نزدیک به زمینم-رود نزدیک به آبشارم

بافت های حافظه در مغز-خاطره های اجباری
زندگی زیر جهنم-تنها انتخاب که داری

رواندازی که الیافش-عطر خواب با تو رو میده
لبه ی لیوان آبی که لب تورو چشیده

آب و آفتاب و لالایی-همه چیز که به تو دادم
رز مشکی نزدیکم-ابر در تاثیر بادم

تنتو بین شکافی روی پوست تنم کاشتم
روحتو همراه خونم توی رگهام نگه داشتم

رز مشکی برهنه تو فصل پنجم سال سرد
دو هویت تو یه کالبد یعنی همزیستی پر درد

حس دور موندنه از تو بین دو قطب یه بازی
ملاقات هر شب ما تو زندگی های موازی

میوه ی درخت وهمم-رز مشکی بی نقصم
وسط پاییز ساکن برگکه در حاله رقصم

ارتفاع دست نیافته به بلندی مستی‌ام
برفه همراهه طوفانم-قسمت فراهستی‌ام
`,
		MercurialFountains: `فواره‌های جیوه‌ای
من ساکن سرزمینی که از قلمرو خدا
با دیوارای شیشه ای بلندی شده جدا

پیش از تبعید من خدا روحو از پیکرم مکید
و تو فرشته ای بودی که روحمو در تو دمید

تراشه های تبعیدی-شبها در امتداد مرز
در کمین تصاحب قلب فرشته های هرز

و من که روحم گم شده تو خواب حس میکنم بویی
گاهی تصویر مبهم از تحقق آرزویی

عطر گیاه تازه ای زیر پای برهنتو
حس میکنم اینور مرز و ارتعاش خندتو

فواره های جیوه ای که میبارن روی تنت
با وزش باد مرطوب سر میخورن رو بدنت

از پشت شیشه های مرز گاهی زل میزنی به من
فکر میکنی نقاشی‌ام-تصویر ذهنی یه تن

فکر میکنی من محصولی از چرخه ی طبیعتم
طوفان ساحلی گاهی تا لب مرز میارتم

تو هیچ ایده ای نداری که من خود بیگانتم
و تو آروم روحمی و من خود بیگانتم

تو هیچ ایده ای نداری که تو همه وجوهمی
سلولهای قلبمی-زیر ذره های روحمی

تو هیچ نمیدونی که تو همون منه دیوانه‌ای
تو برای روح خستم زیباترین پیمانه‌ای

و ابرها پایین میان و رو شیشه پر نم میشه
و صورتت با لبخندی از دیدم محو و کم میشه
`,
		Xanax: `زاناکس
وای این تصویر تکراری از صورت تو توی خواب
پلک های نیمه باز من دوباره پر شدن از آب

جزییات صورتت که ارسال میشن به حافظه
تحلیلگری به نام ذهن که از درک عشق عاجزه

تصمیم مغز برای واکنش دادن به خاطره
توسط اعصاب منتهی به قلب باکره

ترشح هورمون های تحریک درد توی خونم
با سرخرگها پیغام درد میرسه به همه جونم

چرندیات بی ربط و پولساز دکتر پلید
تجویز صورتی و روتین اون مرد سفید

یک افتضاح عاطفی، طبق قوانین مورفی
یک ماده ی شیمیایی که میکنه معرفی

بی تامل تو قفسه پی قرص‌های صورتی
یک محصول شیمیایی، فراورده ی صنعتی

بلعیدن صورتی‌ها برای فتح راحتی
برای رخنه کردن به دیوارهای‌امنییتی



برای فرار از خوده منه به تو عادتی
جذب از دیواره ی معده، ورود به خون لعنتی

و پولک‌های صورتی هجوم میبرن به مغز
و آروم دفنت می‌کنن اجساد خاطرات نحس

ذهنم دست بر میداره از ادامه‌ی تایید و نقض
و بی‌وزنی کم میکنه کمی از بی تابی نبض

پا توی ساحل میذارم، بیرون از درهای قفس
و بغضم پایینترمیره کمی از مجرای نفس

هادی پاکزاد-اسفند 1389`,
		GoodHappening: `اتفاق خوب
وقتي فرسنگ‌ها دور از من احساس دلتنگي کني
قلب من روزهاست سرد شده از اين عشق تقارني

وقتي ساعت ها بعد از اين روزهاي تنهايي داري
ذهن من دست کشيده از توهم هاي تکراري

وقتي تمام سلول‌هات يه آغوش امن ميخوان
وقتي همه خاطره هاي لعنتيت به حرف ميان

ترکم که ميکردي نور فانوس هاي دريا مردن
موريانه هاي خيال قايق نجاتو خوردن

فرشته هاي دريايي منو به موج ها سپردن
امواج سهمگين وحشت منو تا مرز مرگ بردن

وقتي تمام حسرت‌ها به مرگ اضافه‌ت ميکن
وقتي همه غم‌هاي فلسفي کلافه ت ميکنن

غم ها که هرچقدر مي خندي احاطه ت ميکنن
نفس ها به بوي جسد به تدريج عادت ميکنن

وقتي ميخواي با ديوارا حرف بزني و ممکن نيست
وقتي تو مجراي نفس چيزي جز بغض مزمن نيست

 وقتي اطرافت همه چيز اونقدر خوبه که سير شدي
مي‌بيني تو انتظار اتفاق خوب پير شدي
وقتي وجودت خاليه و از درون درد مي‌کشي
چشماي پر اشکتو به شيشه هاي سرد ميکشي

وقتي همه جونتو از نياز به بوسه ميدري
براي بوسيده شدن پناه به عکس ها ميبري

وقتي من نيستم که روحت زير پوستم گرم بمونه
وقتي من نيستم که روحت زير پوستم گرم بمونه

هادی پاکزاد-زمستان 1389
`,
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

