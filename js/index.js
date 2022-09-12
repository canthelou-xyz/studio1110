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
    if (force || confirm("Avez-vous terminé \"" + fiche.name + "\" ?")) {
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
        if (confirm("Arrêter la fiche \"" + fiche.name + "\" ?")) {
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
            name: "Plannifier la journée",
            text: ["Utiliser PLAN DU MATIN"]
        }, {
            name: "Travailler sur la dernière tâche de la veille",
            text: ["Utiliser BLOCK WORK 1 HOUR"]
        }, {
            name: "Travailler",
            text: ["Utiliser BLOCK WORK 1 HOUR"]
        }, {
            name: "Pause",
            text: ["Mails", "Téléphone", "Social", "Personnel"]
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
            name: "Clore la journée",
            text: ["Faire le point de ce qui a été fait dans la journée", "Mails", "Téléphone", "Social", "Personnel"]
        }]
    }, {
        id: "plan-matin",
        name: "Plan du matin",
        duration: "15",
        tasks: [{
            name: "Relire les travaux de la veille.",
            text: ["Faire le point sur ce qui a été fait et non fait."]
        }, {
            name: "Trier les mails.",
            text: ["Répondre aux mails demandant une réponse courte.", "Stocker les mails importants", "Faire un Post-it pour les mails demandant une action"]
        }, {
            name: "Revoir les tâches de la journée.",
            text: ["En fonction de mails et des tâches de la veille.", "Démarrer par la denière tâche de la veille."]
        }, {
            name: "Visualiser le plan général.",
            text: ["Le plan de la semaine, du mois et la liste des projets en cours.", "L'état des comptes, des dépenses à venir et des entrées futures."]
        }, {
            name: "Conseils",
            text: ["Toujours envisager la dualité, le meilleur et le pire, le côté noir et le côté blanc, tout en se basant sur le meilleur ou le plus complet et en organisant de petits éléments et en segmentant les choses complexes en petites tâches plus facile à appréhender dans leur réalisation; prendre de la hauteur, changer de point de vue et regarder l'ensemble et ce qui a déjà été accompli/mis en place, quitte à s'appuyer sur des processus connus, répétitifs, ordonnés et vérifiés, sans chercher pas à brûler les étapes. Démarrer le travail rapidement, même si ce n'est qu'un essai, et surtout ne pas tergiverser ou être bloqué dans l'analyse, et toujours travailler au moins un peu sur une de tâches qu'on s'est assigné même si on ne peut la boucler comme prévu. Prendre des notes, faire des recherches sur l'existant ou le déjà fait pour débloquer une situation. Être là maintenant entièrement, sans constamment regarder ce qui a été fait ou penser à ce qui va être fait."]
        }]
    }, {
        id: "methode-hour",
        name: "Block Work 1 Hour",
        duration: "60",
        tasks: [{
            name: "Déterminer quoi faire et le noter",
            text: ["En partant de ce qui existe", "En partant de ce qui a déjà été fait"]
        }, {
            name: "Faire, Faire fonctionner, Faire fonctionner bien",
            text: ["Créer la solution", "Tester pour éviter le pire et assurer le meilleur", "Chercher des alternative et changer de point de vue"]
        }, {
            name: "Evaluer et noter ce qui a été fait",
            text: ["Sur Post-It", "Sur Evernote"]
        }, {
            name: "Sauvegarder",
            text: ["GIT, Evernote ou autre"]
        }]
    }, {
        id: "methode-1110",
        name: "Méthode 1110",
        duration: "25",
        tasks: [{
            name: "Segmenter et construire par améliorations progressives",
            text: ["Le projet complet <- Un groupe de fonctionnalités/écrans <- Les composants du groupe/écran <- Créer le composant à part et indépendamment comme un projet à part"]
        }, {
            name: "Imaginer, Créer, Améliorer, Intégrer, Sauvegarder",
            text: ["Répéter..."]
        }, {
            name: "Revoir, mettre à jour, analyser et s'inspirer",
            text: ["Commencer par revoir ce qu'on a déjà fait et ce qui existe", "Définir l'objectif et imaginer la solution, Dessiner, Chercher des solutions existantes"]
        }, {
            name: "Coder le moteur",
            text: ["Coder l'ensemble du moteur de l'application, Données en dur, Pas de SGBD, UI générique factice"]
        }, {
            name: "Coder les données",
            text: ["Brancher et récupérer toutes les données, Données réelles, SGBD et REST, UI générique factice"]
        }, {
            name: "Coder l'interface et ergonomie",
            text: ["Créer l'ensemble de l'UI, Intégration, Animer l'UI, Templates sur l'UI, Evènements..."]
        }, {
            name: "Tester la solution",
            text: ["Eviter le pire et assurer le meilleur", "Tests automatiques, Tests aux limites, Tests de régression", "Effets de bord"]
        }, {
            name: "Chercher une alternative",
            text: ["Chercher une alternative, Changer d'algorithme, Changer d'angle d'attaque"]
        }, {
            name: "Notes, sauvegardes et révision du planning",
            text: ["Prendre des notes, Faire une sauvegarde, Mettre à jour planning et tâches, Prévenir et diffuser"]
        }]
    }, {
        id: "coding-principles",
        name: "Coding Principles",
        duration: "5",
        tasks: [{
            name: "Dualité",
            text: ["Toujours envisager le meilleur et le pire des cas, le cas vide et le cas trop plein, en codant pour éviter le pire et assurer le meilleur. Procéder par étapes simples, répétitives et basées sur des processus concrets."]
        }, {
            name: "Coder simplement",
            text: ["Le code est simple à comprendre, le code est simple à expliquer, utiliser et étendre"]
        }, {
            name: "Composer",
            text: ["La composition est un outils puissant permettant d'assembler des pièces indépendantes pour former une application plus complexe", "Communicating Sequential Processes & Functional Reactive Programming", "Coder, si possible, à part du projet global en composant des unités indépendantes du projet, avec une construction progressive (UI/Moteur/Données), même si c'est plus long, et commencer par reprendre ou s'inspirer du code déjà fait par soit ou un autre. Ne pas hésiter à demander de l'aide, faire des recherches, voire changer d'algorithme ou d'angle d'attaque et prendre des notes.", "Construction par améliorations progressives"]
        }, {
            name: "Ecrire les tests avant",
            text: ["Qu'est-ce que vous testez et qu'est-ce que ça doit faire", "Quelle est la sortie et quelle devait être la sortie"]
        }, {
            name: "GOF",
            text: ["Programmer des interface et non des implémentations, Favoriser la composition sur l'héritage"]
        }, {
            name: "Ne pas compliquer",
            text: ["KISS", "Make it work, make it work right, make it fast", "Savoir ce que signifie faire fonctionner", "Démarrer au commencement", "Démarrer par des tests", "Faites une chose", "Démarrer petit et itérer"]
        }]
    }, {
        id: "ameliorer-corriger",
        name: "Améliorer/Corriger",
        duration: "25",
        tasks: [{
            name: "Mettre à jour",
            text: ["Les framework et les sources", "npm update", "git add + commit", "grunt dev"]
        }, {
            name: "Trouver une solution locale temporaire",
            text: ["La solution doit être corrigée dans un contaxte précis au moins"]
        }, {
            name: "Résoudre les effets de bord",
            text: ["Sur différents devices ou résolutions", "Via des recherches plein-texte pour des équivalents"]
        }, {
            name: "Terminer et sauvegarder",
            text: ["Il n'y a plus d'effets de bord", "Mettre à jour le GIT", "Prendre des notes"]
        }]
    }, {
        id: "plannifier",
        name: "Plannifier",
        duration: "25",
        tasks: [{
            name: "Conseils",
            text: ["S'appuyer sur les précédents projets et leur planification, en tout cas utiliser des cas concrets et pas du vent ou son intuition, mais mieux vaut prévoir plus, et planifier au pire, surtout quand on pense que ce sera rapide ou sur des projets urgents, et revoir régulièrement le planning en cours d'avancement.", "Mieux vaut avoir un long planning qu'un retard, et en cas de blocage, passer à autre chose. Le temps de travail doit être limité à 4h ou 6h dans une journée type, et prendre en compte qu'on ne fera pas tout en une seule fois.", "Il est plus facile de planifier la journée qu'une semaine donc planifier de petits éléments de travail qui assemblés formeront le projet.", "Résoudre les retards par des décisions positives pour l'avancement et le client et noter tous les problèmes de planification rencontrés dans les projets en cours."]
        }, {
            name: "Lister sur Post-it",
            text: ["Ecrans, design, découpes CSS", "Technologies, algorithmes, animations, fonctions", "Formaat de données, imports de données, sauvegarde, transport"]
        }, {
            name: "Grouper les Post-it",
            text: ["Former des itérations cohérentes", "Voir avec le client"]
        }, {
            name: "Estimer le temps",
            text: ["De chaque Post-it", "Redécouper si nécessaire"]
        }, {
            name: "Dates de livraison",
            text: ["1 à 5 dates", "Prévoir des jours entre", "Organiser les contenus avec les post-it"]
        }]
    }, {
        id: "eviter",
        name: "Eviter comme la peste",
        duration: "5",
        tasks: [{
            name: "Les agences",
            text: ["Les jeunes", "Une à deux personnes", "Pressées"]
        }, {
            name: "Les projets",
            text: ["Les gros projets avec des inconnus", "Les reprises de code", "Les Wordpress", "Les newsletters"]
        }, {
            name: "Les délais imprécis"
        }, {
            name: "Un brief bancal"
        }]
    }]
};

run();