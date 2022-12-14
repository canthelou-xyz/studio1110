function run() {
    Handlebars.registerHelper("inc", function(value, options) {
        return parseInt(value) + 1;
    });

    var source = document.getElementById("article-template").innerHTML;
    var template = Handlebars.compile(source);
    var html = template(articles);

    document.querySelector(".swiper-wrapper").innerHTML = html;

    [].forEach.call(articles.articles, function(el, i) {
        console.log("init", el.name);
        new Fiche().init(el.id, el);
    });

    var mySwiper = new Swiper('.swiper-container', {
        setWrapperSize: true,
        autoHeight: true,
        roundLengths: true,
        paginationHide: false,
        pagination: ".swiper-pagination",
        paginationClickable: true,
        loop: true,
        simulateTouch: false,
        shortSwipes: false,
        longSwipes: false,
        followFinger: false,
        onlyExternal: true
    })
}

function Fiche() {
    var id = undefined;
    var lastSel = undefined;
    var duration = undefined;
    var to = undefined;
    var timeint = undefined;
}
Fiche.prototype.startTimerIfNeeded = function(fiche) {
    if (!this.duration) {
        this.duration = parseInt(document.getElementById(this.id).getAttribute("data-duration"));
        var me = this;
        this.changeTime(document.getElementById(this.id).getAttribute("data-duration"));
        if (this.duration > 0) {
            this.timeint = setInterval(function() {
                me.duration -= 1;
                me.changeTime(me.duration);
                if (me.duration <= 0) {
                    me.endTimer(fiche, false);
                }
            }, 60 * 1000);
            this.to = setTimeout(function() {
                me.changeTime(0);
                me.endTimer(fiche, false)
            }, this.duration * 60 * 1000);
        }
    }
}
Fiche.prototype.changeTime = function(t) {
    if (t > 0) {
        document.querySelector("#" + this.id + " h2 span").innerHTML = t + " minutes";
    } else {
        document.querySelector("#" + this.id + " h2 span").innerHTML = "";
    }
}
Fiche.prototype.endTimer = function(fiche, force) {
    force = force || false;
    clearTimeout(this.to);
    clearInterval(this.timeint);
    this.to = undefined;
    this.timeint = undefined;
    this.duration = undefined;
    this.changeTime(document.getElementById(this.id).getAttribute("data-duration"));
    if (force || confirm("Avez-vous termin?? \"" + fiche.name + "\" ?")) {
        if (this.lastSel) {
            this.lastSel.classList.remove("current");
        }
    } else {
        this.startTimerIfNeeded(fiche);
    }
}
Fiche.prototype.select = function(el) {
    if (!el.classList.contains("current")) {
        if (this.lastSel) {
            this.lastSel.classList.remove("current");
        }
        el.classList.add("current");
    }
    this.lastSel = el;
}
Fiche.prototype.init = function(id, fiche) {
    this.id = id;
    var me = this;
    this.changeTime(document.getElementById(this.id).getAttribute("data-duration"));
    [].forEach.call(document.querySelectorAll('.processus#' + id + ' li'), function(el, i) {
        el.addEventListener("click", function(ev) {
            ev.preventDefault();
            me.select(el);
            me.startTimerIfNeeded(fiche);
        });
    });
    document.querySelector("#" + this.id + " h2 span").addEventListener("click", function(ev) {
        if (confirm("Arr??ter la fiche \"" + fiche.name + "\" ?")) {
            me.endTimer(fiche, true);
        }
    });
}

var articles = {
    articles: [{
        id: "plan-jour",
        name: "Plan du jour",
        duration: "0",
        tasks: [{
            name: "Plannifier la journ??e",
            text: ["Utiliser PLAN DU MATIN"]
        }, {
            name: "Travailler sur la derni??re t??che de la veille",
            text: ["Utiliser BLOCK WORK 1 HOUR"]
        }, {
            name: "Travailler",
            text: ["Utiliser BLOCK WORK 1 HOUR"]
        }, {
            name: "Pause",
            text: ["Mails", "T??l??phone", "Social", "Personnel"]
        }, {
            name: "Travailler",
            text: ["Utiliser BLOCK WORK 1 HOUR"]
        }, {
            name: "Travailler",
            text: ["Utiliser BLOCK WORK 1 HOUR"]
        }, {
            name: "Travailler",
            text: ["Utiliser BLOCK WORK 1 HOUR"]
        }, {
            name: "Clore la journ??e",
            text: ["Faire le point de ce qui a ??t?? fait dans la journ??e", "Mails", "T??l??phone", "Social", "Personnel"]
        }]
    }, {
        id: "plan-matin",
        name: "Plan du matin",
        duration: "15",
        tasks: [{
            name: "Relire les travaux de la veille.",
            text: ["Faire le point sur ce qui a ??t?? fait et non fait."]
        }, {
            name: "Trier les mails.",
            text: ["R??pondre aux mails demandant une r??ponse courte.", "Stocker les mails importants", "Faire un Post-it pour les mails demandant une action"]
        }, {
            name: "Revoir les t??ches de la journ??e.",
            text: ["En fonction de mails et des t??ches de la veille.", "D??marrer par la deni??re t??che de la veille."]
        }, {
            name: "Visualiser le plan g??n??ral.",
            text: ["Le plan de la semaine, du mois et la liste des projets en cours.", "L'??tat des comptes, des d??penses ?? venir et des entr??es futures."]
        }, {
            name: "Conseils",
            text: ["Toujours envisager la dualit??, le meilleur et le pire, le c??t?? noir et le c??t?? blanc, tout en se basant sur le meilleur ou le plus complet et en organisant de petits ??l??ments et en segmentant les choses complexes en petites t??ches plus facile ?? appr??hender dans leur r??alisation; prendre de la hauteur, changer de point de vue et regarder l'ensemble et ce qui a d??j?? ??t?? accompli/mis en place, quitte ?? s'appuyer sur des processus connus, r??p??titifs, ordonn??s et v??rifi??s, sans chercher pas ?? br??ler les ??tapes. D??marrer le travail rapidement, m??me si ce n'est qu'un essai, et surtout ne pas tergiverser ou ??tre bloqu?? dans l'analyse, et toujours travailler au moins un peu sur une de t??ches qu'on s'est assign?? m??me si on ne peut la boucler comme pr??vu. Prendre des notes, faire des recherches sur l'existant ou le d??j?? fait pour d??bloquer une situation. ??tre l?? maintenant enti??rement, sans constamment regarder ce qui a ??t?? fait ou penser ?? ce qui va ??tre fait."]
        }]
    }, {
        id: "methode-hour",
        name: "Block Work 1 Hour",
        duration: "60",
        tasks: [{
            name: "D??terminer quoi faire et le noter",
            text: ["En partant de ce qui existe", "En partant de ce qui a d??j?? ??t?? fait"]
        }, {
            name: "Faire, Faire fonctionner, Faire fonctionner bien",
            text: ["Cr??er la solution", "Tester pour ??viter le pire et assurer le meilleur", "Chercher des alternative et changer de point de vue"]
        }, {
            name: "Evaluer et noter ce qui a ??t?? fait",
            text: ["Sur Post-It", "Sur Evernote"]
        }, {
            name: "Sauvegarder",
            text: ["GIT, Evernote ou autre"]
        }]
    }, {
        id: "methode-1110",
        name: "M??thode 1110",
        duration: "25",
        tasks: [{
            name: "Segmenter et construire par am??liorations progressives",
            text: ["Le projet complet <- Un groupe de fonctionnalit??s/??crans <- Les composants du groupe/??cran <- Cr??er le composant ?? part et ind??pendamment comme un projet ?? part"]
        }, {
            name: "Imaginer, Cr??er, Am??liorer, Int??grer, Sauvegarder",
            text: ["R??p??ter..."]
        }, {
            name: "Revoir, mettre ?? jour, analyser et s'inspirer",
            text: ["Commencer par revoir ce qu'on a d??j?? fait et ce qui existe", "D??finir l'objectif et imaginer la solution, Dessiner, Chercher des solutions existantes"]
        }, {
            name: "Coder le moteur",
            text: ["Coder l'ensemble du moteur de l'application, Donn??es en dur, Pas de SGBD, UI g??n??rique factice"]
        }, {
            name: "Coder les donn??es",
            text: ["Brancher et r??cup??rer toutes les donn??es, Donn??es r??elles, SGBD et REST, UI g??n??rique factice"]
        }, {
            name: "Coder l'interface et ergonomie",
            text: ["Cr??er l'ensemble de l'UI, Int??gration, Animer l'UI, Templates sur l'UI, Ev??nements..."]
        }, {
            name: "Tester la solution",
            text: ["Eviter le pire et assurer le meilleur", "Tests automatiques, Tests aux limites, Tests de r??gression", "Effets de bord"]
        }, {
            name: "Chercher une alternative",
            text: ["Chercher une alternative, Changer d'algorithme, Changer d'angle d'attaque"]
        }, {
            name: "Notes, sauvegardes et r??vision du planning",
            text: ["Prendre des notes, Faire une sauvegarde, Mettre ?? jour planning et t??ches, Pr??venir et diffuser"]
        }]
    }, {
        id: "coding-principles",
        name: "Coding Principles",
        duration: "5",
        tasks: [{
            name: "Dualit??",
            text: ["Toujours envisager le meilleur et le pire des cas, le cas vide et le cas trop plein, en codant pour ??viter le pire et assurer le meilleur. Proc??der par ??tapes simples, r??p??titives et bas??es sur des processus concrets."]
        }, {
            name: "Coder simplement",
            text: ["Le code est simple ?? comprendre, le code est simple ?? expliquer, utiliser et ??tendre"]
        }, {
            name: "Composer",
            text: ["La composition est un outils puissant permettant d'assembler des pi??ces ind??pendantes pour former une application plus complexe", "Communicating Sequential Processes & Functional Reactive Programming", "Coder, si possible, ?? part du projet global en composant des unit??s ind??pendantes du projet, avec une construction progressive (UI/Moteur/Donn??es), m??me si c'est plus long, et commencer par reprendre ou s'inspirer du code d??j?? fait par soit ou un autre. Ne pas h??siter ?? demander de l'aide, faire des recherches, voire changer d'algorithme ou d'angle d'attaque et prendre des notes.", "Construction par am??liorations progressives"]
        }, {
            name: "Ecrire les tests avant",
            text: ["Qu'est-ce que vous testez et qu'est-ce que ??a doit faire", "Quelle est la sortie et quelle devait ??tre la sortie"]
        }, {
            name: "GOF",
            text: ["Programmer des interface et non des impl??mentations, Favoriser la composition sur l'h??ritage"]
        }, {
            name: "Ne pas compliquer",
            text: ["KISS", "Make it work, make it work right, make it fast", "Savoir ce que signifie faire fonctionner", "D??marrer au commencement", "D??marrer par des tests", "Faites une chose", "D??marrer petit et it??rer"]
        }]
    }, {
        id: "ameliorer-corriger",
        name: "Am??liorer/Corriger",
        duration: "25",
        tasks: [{
            name: "Mettre ?? jour",
            text: ["Les framework et les sources", "npm update", "git add + commit", "grunt dev"]
        }, {
            name: "Trouver une solution locale temporaire",
            text: ["La solution doit ??tre corrig??e dans un contaxte pr??cis au moins"]
        }, {
            name: "R??soudre les effets de bord",
            text: ["Sur diff??rents devices ou r??solutions", "Via des recherches plein-texte pour des ??quivalents"]
        }, {
            name: "Terminer et sauvegarder",
            text: ["Il n'y a plus d'effets de bord", "Mettre ?? jour le GIT", "Prendre des notes"]
        }]
    }, {
        id: "plannifier",
        name: "Plannifier",
        duration: "25",
        tasks: [{
            name: "Conseils",
            text: ["S'appuyer sur les pr??c??dents projets et leur planification, en tout cas utiliser des cas concrets et pas du vent ou son intuition, mais mieux vaut pr??voir plus, et planifier au pire, surtout quand on pense que ce sera rapide ou sur des projets urgents, et revoir r??guli??rement le planning en cours d'avancement.", "Mieux vaut avoir un long planning qu'un retard, et en cas de blocage, passer ?? autre chose. Le temps de travail doit ??tre limit?? ?? 4h ou 6h dans une journ??e type, et prendre en compte qu'on ne fera pas tout en une seule fois.", "Il est plus facile de planifier la journ??e qu'une semaine donc planifier de petits ??l??ments de travail qui assembl??s formeront le projet.", "R??soudre les retards par des d??cisions positives pour l'avancement et le client et noter tous les probl??mes de planification rencontr??s dans les projets en cours."]
        }, {
            name: "Lister sur Post-it",
            text: ["Ecrans, design, d??coupes CSS", "Technologies, algorithmes, animations, fonctions", "Formaat de donn??es, imports de donn??es, sauvegarde, transport"]
        }, {
            name: "Grouper les Post-it",
            text: ["Former des it??rations coh??rentes", "Voir avec le client"]
        }, {
            name: "Estimer le temps",
            text: ["De chaque Post-it", "Red??couper si n??cessaire"]
        }, {
            name: "Dates de livraison",
            text: ["1 ?? 5 dates", "Pr??voir des jours entre", "Organiser les contenus avec les post-it"]
        }]
    }, {
        id: "eviter",
        name: "Eviter comme la peste",
        duration: "5",
        tasks: [{
            name: "Les agences",
            text: ["Les jeunes", "Une ?? deux personnes", "Press??es"]
        }, {
            name: "Les projets",
            text: ["Les gros projets avec des inconnus", "Les reprises de code", "Les Wordpress", "Les newsletters"]
        }, {
            name: "Les d??lais impr??cis"
        }, {
            name: "Un brief bancal"
        }]
    }]
};

run();