// Clé pour le stockage dans LocalStorage
        
        const STORAGE_KEY = 'membresRufisque';

        // --- Fonctions de Gestion de la Base de Données (LocalStorage) ---

        /** Charge la liste des membres depuis le stockage local */
        function chargerMembres() {
            const data = localStorage.getItem(STORAGE_KEY);
            // Retourne le tableau des membres, ou un tableau vide si aucune donnée n'est trouvée
            return data ? JSON.parse(data) : [];
        }

        /** Sauvegarde la liste des membres dans le stockage local */
        function sauvegarderMembres(membres) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(membres));
        }
        
        // --- Fonction d'Affichage Principale ---

        /** Affiche la liste et met à jour les statistiques */
                /** Affiche la liste et met à jour les statistiques */
             function afficherTout(membresFiltres = null) {
            const membres = chargerMembres();
            // Utilise la liste complète si aucun filtre n'est passé, sinon utilise la liste filtrée
            const listeAffichee = membresFiltres || membres;
            
            const listeUl = document.getElementById('liste-membres');
            listeUl.innerHTML = ''; // Vide la liste existante

            // 1. Mise à jour des statistiques globales (basée sur la liste complète)
            document.getElementById('total-membres').textContent = membres.length;

            // 2. Calcul du regroupement par fonction (basé sur la liste complète)
            const stats = calculerStats(membres);
            afficherStats(stats);
            
            // 3. Affichage de la liste des membres (triés par nom)
            if (listeAffichee.length === 0) {
                 listeUl.innerHTML = '<li style="text-align: center; color: #dc3545; padding: 15px;">Aucun membre trouvé correspondant à la recherche.</li>';
                 return;
            }

            listeAffichee.sort((a, b) => a.nom.localeCompare(b.nom)).forEach(membre => {
                const li = document.createElement('li');
                li.className = 'membre-item';
                li.innerHTML = `
                    <div class="membre-info">
                        <strong>${membre.nom}</strong>
                        <small>Tél: ${membre.telephone} | Fonction: ${membre.fonction}</small>
                    </div>
                    <div class="membre-actions">
                        <button class="btn-modifier" onclick="preparerModification(${membre.id})">Modifier</button>
                        <button class="btn-supprimer" onclick="supprimerMembre(${membre.id})">Supprimer</button>
                    </div>
                `;
                listeUl.appendChild(li);
            });
        }

            // 1. Mise à jour des statistiques globales
            document.getElementById('total-membres').textContent = membres.length;

            // 2. Calcul du regroupement par fonction
            const stats = calculerStats(membres);
            afficherStats(stats);
            
            // 3. Affichage de la liste des membres (triés par nom)
            membres.sort((a, b) => a.nom.localeCompare(b.nom)).forEach(membre => {
                const li = document.createElement('li');
                li.className = 'membre-item';
                li.innerHTML = `
                    <div class="membre-info">
                        <strong>${membre.nom}</strong>
                        <small>Tél: ${membre.telephone} | Fonction: ${membre.fonction}</small>
                    </div>
                    <div class="membre-actions">
                        <button class="btn-modifier" onclick="preparerModification(${membre.id})">Modifier</button>
                        <button class="btn-supprimer" onclick="supprimerMembre(${membre.id})">Supprimer</button>
                    </div>
                `;
                listeUl.appendChild(li);
            });
        
        // --- Fonctions de Calcul et d'Affichage des Statistiques ---
        
        /** Regroupe les membres et compte les effectifs par fonction */
        function calculerStats(membres) {
            const stats = {};
            membres.forEach(m => {
                const fonction = m.fonction;
                stats[fonction] = (stats[fonction] || 0) + 1;
            });
            // Convertir l'objet en tableau pour le tri
            return Object.entries(stats).map(([fonction, nombre]) => ({ fonction, nombre }));
        }
        
        /** Affiche le regroupement par fonction */
        function afficherStats(stats) {
            const statsDiv = document.getElementById('stats-regroupement');
            statsDiv.innerHTML = '';
            
            // Tri par nombre décroissant
            stats.sort((a, b) => b.nombre - a.nombre).forEach(stat => {
                statsDiv.innerHTML += `<p><strong>${stat.fonction}</strong> : ${stat.nombre} membre(s)</p>`;
            });
            if (stats.length === 0) {
                 statsDiv.innerHTML = '<p style="text-align: center; color: #6c757d;">Aucune fonction recensée.</p>';
            }
        }
        
        // --- Fonctions d'Action (Ajout, Suppression, Modification) ---

        /** Ajout d'un nouveau membre */
        function ajouterMembre() {
            const nomInput = document.getElementById('nom');
            const telInput = document.getElementById('telephone');
            const fonctionInput = document.getElementById('fonction');

            const nom = nomInput.value.trim();
            const telephone = telInput.value.trim();
            // Capitaliser la fonction comme dans la version Python
            const fonction = fonctionInput.value.trim().charAt(0).toUpperCase() + fonctionInput.value.trim().slice(1);

            if (nom && telephone && fonction) {
                const membres = chargerMembres();
                // Générer un ID unique (le plus simple : timestamp)
                const id = Date.now(); 
                
                const nouveauMembre = { id, nom, telephone, fonction };
                membres.push(nouveauMembre);
                
                sauvegarderMembres(membres);
                
                // Réinitialiser le formulaire
                nomInput.value = '';
                telInput.value = '';
                fonctionInput.value = '';
                
                afficherTout();
            } else {
                alert("Veuillez remplir tous les champs !");
            }
        }

        /** Supprime un membre par son ID */
        function supprimerMembre(id) {
            if (confirm("Êtes-vous sûr de vouloir supprimer ce membre ?")) {
                let membres = chargerMembres();
                // Filtre tous les membres sauf celui avec l'ID donné
                membres = membres.filter(m => m.id !== id);
                sauvegarderMembres(membres);
                afficherTout();
            }
        }

        /** Prépare le formulaire pour la modification */
        function preparerModification(id) {
            const membres = chargerMembres();
            const membre = membres.find(m => m.id === id);

            if (membre) {
                // Masquer le formulaire d'ajout et afficher celui de modification
                document.getElementById('form-ajout').style.display = 'none';
                document.getElementById('form-modification').style.display = 'block';

                // Pré-remplir le formulaire de modification
                document.getElementById('edit-id').value = membre.id;
                document.getElementById('edit-nom').value = membre.nom;
                document.getElementById('edit-telephone').value = membre.telephone;
                document.getElementById('edit-fonction').value = membre.fonction;
            }
        }

        /** Enregistre les modifications dans LocalStorage */
        function sauvegarderModification() {
            const id = parseInt(document.getElementById('edit-id').value);
            const nom = document.getElementById('edit-nom').value.trim();
            const telephone = document.getElementById('edit-telephone').value.trim();
            const fonction = document.getElementById('edit-fonction').value.trim().charAt(0).toUpperCase() + document.getElementById('edit-fonction').value.trim().slice(1);

            if (nom && telephone && fonction) {
                let membres = chargerMembres();
                const index = membres.findIndex(m => m.id === id);
                
                if (index !== -1) {
                    membres[index].nom = nom;
                    membres[index].telephone = telephone;
                    membres[index].fonction = fonction;
                    
                    sauvegarderMembres(membres);
                    annulerModification(); // Cache le formulaire et rafraîchit l'affichage
                }
            } else {
                alert("Veuillez remplir tous les champs !");
            }
        }

        /** Annule la modification et revient à l'affichage normal */
        function annulerModification() {
            document.getElementById('form-modification').style.display = 'none';
            document.getElementById('form-ajout').style.display = 'block';
            afficherTout();
        }

                // --- Initialisation ---
        // Exécute le tri et l'affichage par défaut quand la page est chargée
        window.onload = appliquerTriEtAfficher; // <-- APPEL CHANGÉ


                        /** Filtre les membres en fonction de la barre de recherche */
        function filtrerMembres(membresTries = null) { // <-- MEMBRES TRIES EST AJOUTÉ
            const termeRecherche = document.getElementById('barre-recherche').value.toLowerCase().trim();
            
            // Utilise la liste déjà triée ou charge la liste non triée si on vient d'une recherche simple
            const membresSource = membresTries || chargerMembres(); 

            if (termeRecherche === "") {
                // Si la barre est vide, affiche la liste triée
                afficherTout(membresSource);
                return;
            }

            // Filtrage : vérifie si le terme de recherche est inclus dans le nom OU dans la fonction
            const membresFiltres = membresSource.filter(membre => {
                const nom = membre.nom.toLowerCase();
                const fonction = membre.fonction.toLowerCase();

                return nom.includes(termeRecherche) || fonction.includes(termeRecherche);
            });

            // Affiche uniquement les membres filtrés
            afficherTout(membresFiltres);
        }


            // Filtrage : vérifie si le terme de recherche est inclus dans le nom OU dans la fonction
            const membresFiltres = membres.filter(membre => {
                const nom = membre.nom.toLowerCase();
                const fonction = membre.fonction.toLowerCase();

                return nom.includes(termeRecherche) || fonction.includes(termeRecherche);
            });

            // Affiche uniquement les membres filtrés
            afficherTout(membresFiltres);

                /** Définit les critères de tri et rafraîchit l'affichage */
        function appliquerTriEtAfficher(inverser = false) {
            const selectTri = document.getElementById('critere-tri');
            
            // 1. Mettre à jour le critère de tri si le select a changé
            triActif = selectTri.value;

            // 2. Inverser l'ordre si le bouton "Inverser" est cliqué
            if (inverser) {
                ordreAscendant = !ordreAscendant;
            }
            
            // 3. Récupérer les membres et les trier
            const membres = chargerMembres();
            
            membres.sort((a, b) => {
                let comparaison;
                
                // Utilise la méthode de comparaison de chaîne pour le texte
                if (triActif === 'nom' || triActif === 'fonction') {
                    // La méthode localeCompare gère mieux les caractères spéciaux (comme les accents)
                    comparaison = a[triActif].localeCompare(b[triActif]);
                } 
                // Pour le téléphone, on peut forcer une comparaison numérique si les valeurs sont numériques,
                // mais la comparaison de chaîne fonctionne bien ici
                else if (triActif === 'telephone') {
                    comparaison = a.telephone.localeCompare(b.telephone);
                }
                
                // Inverser le résultat si l'ordre est descendant
                return ordreAscendant ? comparaison : -comparaison;
            });
            
            // 4. Afficher la liste triée (en tenant compte du filtre de recherche actif)
            // On appelle ici filtrerMembres pour s'assurer que si l'utilisateur a tapé une recherche, 
            // le tri s'applique uniquement sur les résultats de recherche.
            filtrerMembres(membres);
        }

/** Exporte les données des membres au format JSON et force le téléchargement */
function exporterDonnees() {
    const membres = chargerMembres();
    
    // 1. Convertir les données en chaîne JSON lisible (indentation à 2 espaces)
    const dataStr = JSON.stringify(membres, null, 2);
    
    // 2. Créer un objet Blob (Binary Large Object)
    const blob = new Blob([dataStr], { type: "application/json" });
    
    // 3. Créer une URL pour le fichier et un lien de téléchargement invisible
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    // Générer un nom de fichier unique (ex: annuaire_rufisque_20250925.json)
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    a.download = `annuaire_rufisque_${date}.json`; 
    a.href = url;
    
    // 4. Déclencher le clic et nettoyer
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert("Les données ont été exportées avec succès !");
}

/** Lit le fichier JSON sélectionné et importe les données */
function importerDonnees() {
    const fichierInput = document.getElementById('fichier-import');
    const fichier = fichierInput.files[0];
    
    if (!fichier) {
        // Rien à importer si aucun fichier n'a été sélectionné
        return; 
    }
    
    // Utiliser FileReader pour lire le contenu du fichier
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const contenu = e.target.result;
            const nouveauxMembres = JSON.parse(contenu);
            
            // Validation simple : on s'assure que c'est bien un tableau d'objets
            if (!Array.isArray(nouveauxMembres) || nouveauxMembres.some(m => !m.nom || !m.telephone)) {
                alert("Erreur d'importation : Le format du fichier JSON n'est pas valide pour les membres.");
                return;
            }
            
            // Demander confirmation avant d'écraser les données existantes
            if (confirm(`Voulez-vous vraiment importer ${nouveauxMembres.length} membres ? Cela remplacera les données actuelles.`)) {
                
                // Sauvegarder les nouvelles données
                sauvegarderMembres(nouveauxMembres);
                
                // Vider l'input file (pour permettre une nouvelle importation)
                fichierInput.value = '';
                
                // Rafraîchir l'affichage
                appliquerTriEtAfficher(); 
                
                alert(`Succès ! ${nouveauxMembres.length} membres importés.`);
            }
            
        } catch (error) {
            console.error(error);
            alert("Erreur de lecture du fichier. Assurez-vous que le fichier est un JSON valide.");
        }
    };
    
    // Démarre la lecture du fichier en tant que texte
    reader.readAsText(fichier);
}
