import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Début du seed de données...');

    // Nettoyage
    await prisma.journaux_audit.deleteMany();
    await prisma.mouvements_stock.deleteMany();
    await prisma.articles_stock.deleteMany();
    await prisma.reservations_atelier.deleteMany();
    await prisma.ateliers.deleteMany();
    await prisma.historiques_statut_commande.deleteMany();
    await prisma.lignes_commande.deleteMany();
    await prisma.commandes.deleteMany();
    await prisma.produits.deleteMany();
    await prisma.categories.deleteMany();
    await prisma.jetons_rafraichissement.deleteMany();
    await prisma.utilisateurs.deleteMany();

    const motDePasseHash = await bcrypt.hash('MotDePasse1', 12);

    // === UTILISATEURS ===
    const admin = await prisma.utilisateurs.create({
        data: {
            nom_complet: 'Admin Sweet-Cake',
            email: 'admin@sweet-cake.fr',
            mot_de_passe_hash: motDePasseHash,
            telephone: '+33600000001',
            role: 'administrateur',
            langue_preferee: 'fr',
        },
    });

    const gestionnaire = await prisma.utilisateurs.create({
        data: {
            nom_complet: 'Sophie Martin',
            email: 'sophie@sweet-cake.fr',
            mot_de_passe_hash: motDePasseHash,
            telephone: '+33600000002',
            role: 'gestionnaire',
            langue_preferee: 'fr',
        },
    });

    const formateur = await prisma.utilisateurs.create({
        data: {
            nom_complet: 'Chef Pierre Laurent',
            email: 'pierre@sweet-cake.fr',
            mot_de_passe_hash: motDePasseHash,
            telephone: '+33600000003',
            role: 'formateur',
            langue_preferee: 'fr',
        },
    });

    const client1 = await prisma.utilisateurs.create({
        data: {
            nom_complet: 'Marie Dupont',
            email: 'marie@example.com',
            mot_de_passe_hash: motDePasseHash,
            telephone: '+33600000004',
            role: 'client',
            langue_preferee: 'fr',
        },
    });

    const client2 = await prisma.utilisateurs.create({
        data: {
            nom_complet: 'Jean Bernard',
            email: 'jean@example.com',
            mot_de_passe_hash: motDePasseHash,
            telephone: '+33600000005',
            role: 'client',
            langue_preferee: 'en',
        },
    });

    console.log('✅ Utilisateurs créés');

    // === CATEGORIES ===
    const categViennoiseries = await prisma.categories.create({
        data: { nom: 'Viennoiseries', description: 'Croissants, pains au chocolat et autres viennoiseries artisanales' },
    });

    const categGateaux = await prisma.categories.create({
        data: { nom: 'Gâteaux', description: 'Gâteaux de célébration et pâtisseries fines' },
    });

    const categTartes = await prisma.categories.create({
        data: { nom: 'Tartes', description: 'Tartes sucrées et salées' },
    });

    const categMacarons = await prisma.categories.create({
        data: { nom: 'Macarons', description: 'Macarons artisanaux aux saveurs variées' },
    });

    const categPains = await prisma.categories.create({
        data: { nom: 'Pains spéciaux', description: 'Pains artisanaux et spéciaux' },
    });

    console.log('✅ Catégories créées');

    // === PRODUITS ===
    const produits = await Promise.all([
        prisma.produits.create({
            data: { categorie_id: categViennoiseries.id, nom: 'Croissant au beurre', description: 'Croissant pur beurre AOP, feuilletage traditionnel', prix: 1.80, image_url: '/images/croissant.jpg' },
        }),
        prisma.produits.create({
            data: { categorie_id: categViennoiseries.id, nom: 'Pain au chocolat', description: 'Pain au chocolat avec deux barres de chocolat noir', prix: 2.00, image_url: '/images/pain-chocolat.jpg' },
        }),
        prisma.produits.create({
            data: { categorie_id: categViennoiseries.id, nom: 'Chausson aux pommes', description: 'Chausson feuilleté garni de compote de pommes maison', prix: 2.50, image_url: '/images/chausson.jpg' },
        }),
        prisma.produits.create({
            data: { categorie_id: categGateaux.id, nom: 'Fraisier', description: 'Gâteau aux fraises fraîches, crème mousseline et génoise', prix: 28.00, image_url: '/images/fraisier.jpg' },
        }),
        prisma.produits.create({
            data: { categorie_id: categGateaux.id, nom: 'Opéra', description: 'Classique pâtissier au café et chocolat', prix: 32.00, image_url: '/images/opera.jpg' },
        }),
        prisma.produits.create({
            data: { categorie_id: categTartes.id, nom: 'Tarte au citron meringuée', description: 'Tarte au citron avec meringue italienne', prix: 22.00, image_url: '/images/tarte-citron.jpg' },
        }),
        prisma.produits.create({
            data: { categorie_id: categTartes.id, nom: 'Tarte aux fruits rouges', description: 'Tarte sur sablé breton, crème pâtissière et fruits rouges de saison', prix: 25.00, image_url: '/images/tarte-fruits.jpg' },
        }),
        prisma.produits.create({
            data: { categorie_id: categMacarons.id, nom: 'Coffret 12 macarons', description: 'Assortiment de 12 macarons aux parfums variés', prix: 18.00, image_url: '/images/macarons.jpg' },
        }),
        prisma.produits.create({
            data: { categorie_id: categPains.id, nom: 'Pain aux noix', description: 'Pain de campagne aux noix du Périgord', prix: 4.50, image_url: '/images/pain-noix.jpg' },
        }),
        prisma.produits.create({
            data: { categorie_id: categPains.id, nom: 'Focaccia aux olives', description: 'Focaccia italienne aux olives noires et romarin', prix: 5.00, image_url: '/images/focaccia.jpg' },
        }),
    ]);

    console.log('✅ Produits créés');

    // === ATELIERS ===
    const atelier1 = await prisma.ateliers.create({
        data: {
            titre: 'Initiation aux macarons',
            description: 'Apprenez les secrets du macaron parfait : le macaronnage, la ganache et la décoration',
            date_atelier: new Date('2026-05-15'),
            heure_debut: '14:00',
            heure_fin: '17:00',
            capacite: 8,
            places_reservees: 0,
            prix: 75.00,
            cree_par: formateur.id,
        },
    });

    const atelier2 = await prisma.ateliers.create({
        data: {
            titre: 'Pâte feuilletée maison',
            description: 'Maîtrisez la technique de la pâte feuilletée inversée et réalisez croissants et viennoiseries',
            date_atelier: new Date('2026-05-22'),
            heure_debut: '09:00',
            heure_fin: '13:00',
            capacite: 6,
            places_reservees: 0,
            prix: 95.00,
            cree_par: formateur.id,
        },
    });

    const atelier3 = await prisma.ateliers.create({
        data: {
            titre: 'Gâteau de fête multi-étages',
            description: 'Réalisez un gâteau de célébration à 3 étages avec glaçage et décoration professionnelle',
            date_atelier: new Date('2026-06-05'),
            heure_debut: '10:00',
            heure_fin: '16:00',
            capacite: 10,
            places_reservees: 0,
            prix: 120.00,
            cree_par: formateur.id,
        },
    });

    console.log('✅ Ateliers créés');

    // === ARTICLES STOCK ===
    const articleFarine = await prisma.articles_stock.create({
        data: { nom: 'Farine T55', unite: 'kg', quantite: 50, seuil_minimal: 10 },
    });

    const articleBeurre = await prisma.articles_stock.create({
        data: { nom: 'Beurre AOP', unite: 'kg', quantite: 20, seuil_minimal: 5 },
    });

    const articleSucre = await prisma.articles_stock.create({
        data: { nom: 'Sucre en poudre', unite: 'kg', quantite: 30, seuil_minimal: 8 },
    });

    const articleChocolat = await prisma.articles_stock.create({
        data: { nom: 'Chocolat noir 70%', unite: 'kg', quantite: 3, seuil_minimal: 5 },
    });

    const articleOeufs = await prisma.articles_stock.create({
        data: { nom: 'Oeufs frais', unite: 'unité', quantite: 120, seuil_minimal: 30 },
    });

    await prisma.articles_stock.create({
        data: { nom: 'Crème fraîche', unite: 'litre', quantite: 10, seuil_minimal: 3 },
    });

    console.log('✅ Articles de stock créés');

    // === COMMANDES DEMO ===
    const commande1 = await prisma.commandes.create({
        data: {
            client_id: client1.id,
            numero_commande: 'CMD-DEMO-001',
            type_commande: 'retrait',
            statut: 'confirmee',
            statut_paiement: 'paye',
            montant_total: 33.80,
            notes: 'Commande pour le week-end',
            lignes_commande: {
                create: [
                    { produit_id: produits[0].id, quantite: 4, prix_unitaire: 1.80, sous_total: 7.20 },
                    { produit_id: produits[3].id, quantite: 1, prix_unitaire: 28.00, sous_total: 28.00 },
                ],
            },
            historiques_statut_commande: {
                create: [
                    { ancien_statut: 'en_attente', nouveau_statut: 'en_attente', change_par: client1.id, note: 'Commande créée' },
                    { ancien_statut: 'en_attente', nouveau_statut: 'confirmee', change_par: gestionnaire.id, note: 'Commande confirmée' },
                ],
            },
        },
    });

    const commande2 = await prisma.commandes.create({
        data: {
            client_id: client2.id,
            numero_commande: 'CMD-DEMO-002',
            type_commande: 'livraison',
            statut: 'en_attente',
            montant_total: 40.00,
            lignes_commande: {
                create: [
                    { produit_id: produits[4].id, quantite: 1, prix_unitaire: 32.00, sous_total: 32.00 },
                    { produit_id: produits[1].id, quantite: 4, prix_unitaire: 2.00, sous_total: 8.00 },
                ],
            },
            historiques_statut_commande: {
                create: [
                    { ancien_statut: 'en_attente', nouveau_statut: 'en_attente', change_par: client2.id, note: 'Commande créée' },
                ],
            },
        },
    });

    console.log('✅ Commandes démo créées');

    // === RESERVATIONS DEMO ===
    await prisma.reservations_atelier.create({
        data: {
            atelier_id: atelier1.id,
            client_id: client1.id,
            nombre_places: 2,
            montant_total: 150.00,
            statut: 'confirmee',
        },
    });

    await prisma.ateliers.update({
        where: { id: atelier1.id },
        data: { places_reservees: 2 },
    });

    await prisma.reservations_atelier.create({
        data: {
            atelier_id: atelier2.id,
            client_id: client2.id,
            nombre_places: 1,
            montant_total: 95.00,
            statut: 'confirmee',
        },
    });

    await prisma.ateliers.update({
        where: { id: atelier2.id },
        data: { places_reservees: 1 },
    });

    console.log('✅ Réservations démo créées');

    // === MOUVEMENTS STOCK DEMO ===
    await prisma.mouvements_stock.create({
        data: { article_stock_id: articleFarine.id, type_mouvement: 'entree', quantite: 50, raison: 'Livraison initiale', cree_par: gestionnaire.id },
    });

    await prisma.mouvements_stock.create({
        data: { article_stock_id: articleBeurre.id, type_mouvement: 'entree', quantite: 20, raison: 'Livraison initiale', cree_par: gestionnaire.id },
    });

    await prisma.mouvements_stock.create({
        data: { article_stock_id: articleChocolat.id, type_mouvement: 'sortie', quantite: 2, raison: 'Production pâtisseries', cree_par: gestionnaire.id },
    });

    console.log('✅ Mouvements de stock démo créés');

    // === JOURNAUX AUDIT ===
    await prisma.journaux_audit.create({
        data: {
            utilisateur_id: admin.id,
            action: 'SEED_DONNEES',
            type_entite: 'systeme',
            entite_id: null,
            metadonnees: { description: 'Initialisation des données de démonstration' },
        },
    });

    console.log('✅ Journaux d\'audit créés');
    console.log('');
    console.log('🎉 Seed terminé avec succès !');
    console.log('');
    console.log('📧 Comptes de démonstration (mot de passe: MotDePasse1) :');
    console.log(`   Admin:        admin@sweet-cake.fr`);
    console.log(`   Gestionnaire: sophie@sweet-cake.fr`);
    console.log(`   Formateur:    pierre@sweet-cake.fr`);
    console.log(`   Client 1:     marie@example.com`);
    console.log(`   Client 2:     jean@example.com`);
}

main()
    .catch((e) => {
        console.error('❌ Erreur lors du seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
