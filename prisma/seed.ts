import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Début du seed — Sweet-Cake by MK (Mfou, Cameroun)...');

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

    // ══════════════════════════════════════════════════════════════════════════
    // UTILISATEURS
    // ══════════════════════════════════════════════════════════════════════════

    const admin = await prisma.utilisateurs.create({
        data: {
            nom_complet: 'Admin Sweet-Cake',
            email: 'admin@sweet-cake.fr',
            mot_de_passe_hash: motDePasseHash,
            telephone: '+237692042589',
            role: 'administrateur',
            langue_preferee: 'fr',
        },
    });

    const sophieAdmin = await prisma.utilisateurs.create({
        data: {
            nom_complet: 'Sophie Kamga',
            email: 'sophie@sweet-cake.fr',
            mot_de_passe_hash: motDePasseHash,
            telephone: '+237690000002',
            role: 'administrateur',
            langue_preferee: 'fr',
        },
    });

    const paulAdmin = await prisma.utilisateurs.create({
        data: {
            nom_complet: 'Chef Paul Etoga',
            email: 'paul@sweet-cake.fr',
            mot_de_passe_hash: motDePasseHash,
            telephone: '+237690000003',
            role: 'administrateur',
            langue_preferee: 'fr',
        },
    });

    const client1 = await prisma.utilisateurs.create({
        data: {
            nom_complet: 'Marie Ngo',
            email: 'marie@example.com',
            mot_de_passe_hash: motDePasseHash,
            telephone: '+237690000004',
            role: 'client',
            langue_preferee: 'fr',
        },
    });

    const client2 = await prisma.utilisateurs.create({
        data: {
            nom_complet: 'Jean Abena',
            email: 'jean@example.com',
            mot_de_passe_hash: motDePasseHash,
            telephone: '+237690000005',
            role: 'client',
            langue_preferee: 'fr',
        },
    });

    console.log('✅ Utilisateurs créés');

    // ══════════════════════════════════════════════════════════════════════════
    // CATÉGORIES (basées sur le catalogue Sweet-Cake by MK)
    // ══════════════════════════════════════════════════════════════════════════

    const categGateaux = await prisma.categories.create({
        data: { nom: 'Gâteaux', description: 'Gâteaux personnalisés pour toutes vos célébrations' },
    });

    const categGourmandises = await prisma.categories.create({
        data: { nom: 'Gourmandises', description: 'Douceurs sucrées à partager ou à savourer' },
    });

    const categMignardises = await prisma.categories.create({
        data: { nom: 'Mignardises', description: 'Petites bouchées salées et sucrées' },
    });

    console.log('✅ Catégories créées (Gâteaux, Gourmandises, Mignardises)');

    // ══════════════════════════════════════════════════════════════════════════
    // PRODUITS (catalogue officiel Sweet-Cake by MK — Prix en FCFA)
    // ══════════════════════════════════════════════════════════════════════════

    // --- Gâteaux ---
    const produits = await Promise.all([
        prisma.produits.create({
            data: {
                categorie_id: categGateaux.id,
                nom: 'Gâteau Anniversaire',
                description: 'Une création personnalisée, gourmande et élégante pour célébrer comme il se doit.',
                prix: 15000,
                image_url: '/images/gateau-anniversaire.jpg',
            },
        }),
        prisma.produits.create({
            data: {
                categorie_id: categGateaux.id,
                nom: 'Gâteau Mariage',
                description: 'Raffiné et délicat, un gâteau d\'exception pour sublimer le plus beau jour de votre vie.',
                prix: 50000,
                image_url: '/images/gateau-mariage.jpg',
            },
        }),
        prisma.produits.create({
            data: {
                categorie_id: categGateaux.id,
                nom: 'Gâteau Brunch',
                description: 'Léger, généreux et savoureux : la touche sucrée parfaite pour un brunch réussi.',
                prix: 10000,
                image_url: '/images/gateau-brunch.jpg',
            },
        }),

        // --- Gourmandises ---
        prisma.produits.create({
            data: {
                categorie_id: categGourmandises.id,
                nom: 'Cakes',
                description: 'Moelleux et généreux, parfait à partager ou à savourer ou goûter.',
                prix: 5000,
                image_url: '/images/cakes.jpg',
            },
        }),
        prisma.produits.create({
            data: {
                categorie_id: categGourmandises.id,
                nom: 'Cupcakes',
                description: 'Petit, élégant et ultra gourmand : une douceur qui fait toujours plaisir.',
                prix: 2000,
                image_url: '/images/cupcakes.jpg',
            },
        }),

        // --- Mignardises ---
        prisma.produits.create({
            data: {
                categorie_id: categMignardises.id,
                nom: 'Nems',
                description: 'Croustillants et savoureux.',
                prix: 500,
                image_url: '/images/nems.jpg',
            },
        }),
        prisma.produits.create({
            data: {
                categorie_id: categMignardises.id,
                nom: 'Crêpes',
                description: 'Douces et gourmandes.',
                prix: 500,
                image_url: '/images/crepes.jpg',
            },
        }),
        prisma.produits.create({
            data: {
                categorie_id: categMignardises.id,
                nom: 'Beignets soufflés',
                description: 'Légers, moelleux, irrésistibles.',
                prix: 250,
                image_url: '/images/beignets-souffles.jpg',
            },
        }),
        prisma.produits.create({
            data: {
                categorie_id: categMignardises.id,
                nom: 'Mini pizzas',
                description: 'Petites, généreuses, délicieuses.',
                prix: 500,
                image_url: '/images/mini-pizzas.jpg',
            },
        }),
        prisma.produits.create({
            data: {
                categorie_id: categMignardises.id,
                nom: 'Burgers',
                description: 'Frais, juteux, ultra gourmands.',
                prix: 1500,
                image_url: '/images/burgers.jpg',
            },
        }),
    ]);

    console.log('✅ 10 produits créés (catalogue officiel Sweet-Cake by MK)');

    // ══════════════════════════════════════════════════════════════════════════
    // ATELIERS (Pâtisserie)
    // ══════════════════════════════════════════════════════════════════════════

    const atelier1 = await prisma.ateliers.create({
        data: {
            titre: 'Atelier Cupcakes Déco',
            description: 'Apprenez à réaliser et décorer des cupcakes comme un pro.',
            date_atelier: new Date('2026-05-15'),
            heure_debut: '14:00',
            heure_fin: '17:00',
            capacite: 8,
            places_reservees: 0,
            prix: 15000,
            cree_par: paulAdmin.id,
        },
    });

    const atelier2 = await prisma.ateliers.create({
        data: {
            titre: 'Atelier Cake Design',
            description: 'Maîtrisez la technique du cake design pour vos gâteaux de célébration.',
            date_atelier: new Date('2026-05-22'),
            heure_debut: '09:00',
            heure_fin: '13:00',
            capacite: 6,
            places_reservees: 0,
            prix: 25000,
            cree_par: paulAdmin.id,
        },
    });

    const atelier3 = await prisma.ateliers.create({
        data: {
            titre: 'Atelier Beignets & Crêpes',
            description: 'Réalisez des beignets soufflés et crêpes gourmandes maison.',
            date_atelier: new Date('2026-06-05'),
            heure_debut: '10:00',
            heure_fin: '13:00',
            capacite: 10,
            places_reservees: 0,
            prix: 10000,
            cree_par: paulAdmin.id,
        },
    });

    console.log('✅ 3 ateliers créés');

    // ══════════════════════════════════════════════════════════════════════════
    // ARTICLES STOCK
    // ══════════════════════════════════════════════════════════════════════════

    await prisma.articles_stock.create({
        data: { nom: 'Farine T55', unite: 'kg', quantite: 50, seuil_minimal: 10 },
    });
    await prisma.articles_stock.create({
        data: { nom: 'Beurre', unite: 'kg', quantite: 20, seuil_minimal: 5 },
    });
    await prisma.articles_stock.create({
        data: { nom: 'Sucre', unite: 'kg', quantite: 30, seuil_minimal: 8 },
    });
    await prisma.articles_stock.create({
        data: { nom: 'Œufs', unite: 'plateau', quantite: 10, seuil_minimal: 3 },
    });
    await prisma.articles_stock.create({
        data: { nom: 'Chocolat noir', unite: 'kg', quantite: 15, seuil_minimal: 5 },
    });
    await prisma.articles_stock.create({
        data: { nom: 'Crème fraîche', unite: 'litre', quantite: 10, seuil_minimal: 3 },
    });

    console.log('✅ 6 articles de stock créés');

    // ══════════════════════════════════════════════════════════════════════════
    // COMMANDE DÉMO
    // ══════════════════════════════════════════════════════════════════════════

    await prisma.commandes.create({
        data: {
            client_id: client1.id,
            numero_commande: 'CMD-MFU-001',
            type_commande: 'retrait',
            statut: 'confirmee',
            statut_paiement: 'paye',
            montant_total: 19000,
            notes: 'Commande pour anniversaire — Retrait à Mfou',
            lignes_commande: {
                create: [
                    { produit_id: produits[0].id, quantite: 1, prix_unitaire: 15000, sous_total: 15000 },
                    { produit_id: produits[4].id, quantite: 2, prix_unitaire: 2000, sous_total: 4000 },
                ],
            },
            historiques_statut_commande: {
                create: [
                    { ancien_statut: 'en_attente', nouveau_statut: 'en_attente', change_par: client1.id, note: 'Commande créée' },
                    { ancien_statut: 'en_attente', nouveau_statut: 'confirmee', change_par: sophieAdmin.id, note: 'Commande confirmée' },
                ],
            },
        },
    });

    console.log('✅ Commande démo créée (Mfou)');

    // ══════════════════════════════════════════════════════════════════════════
    // RÉSERVATION DÉMO
    // ══════════════════════════════════════════════════════════════════════════

    await prisma.reservations_atelier.create({
        data: {
            atelier_id: atelier1.id,
            client_id: client1.id,
            nombre_places: 2,
            montant_total: 30000,
            statut: 'confirmee',
        },
    });

    await prisma.ateliers.update({
        where: { id: atelier1.id },
        data: { places_reservees: 2 },
    });

    console.log('✅ Réservation démo créée');

    // ══════════════════════════════════════════════════════════════════════════
    // JOURNAL D'AUDIT
    // ══════════════════════════════════════════════════════════════════════════

    await prisma.journaux_audit.create({
        data: {
            utilisateur_id: admin.id,
            action: 'SEED_CATALOGUE_SWEET_CAKE_MK',
            type_entite: 'systeme',
            entite_id: null,
            metadonnees: {
                description: 'Initialisation du catalogue officiel Sweet-Cake by MK — Awae escalier, Mfou',
            },
        },
    });

    console.log('✅ Journal d\'audit créé');
    console.log('');
    console.log('🎉 Seed terminé avec succès !');
    console.log('📍 Sweet-Cake by MK — Awae escalier, Mfou');
    console.log('📞 692 042 589');
}

main()
    .catch((e) => {
        console.error('❌ Erreur lors du seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
