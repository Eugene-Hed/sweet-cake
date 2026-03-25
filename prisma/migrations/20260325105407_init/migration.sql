-- CreateTable
CREATE TABLE `utilisateurs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom_complet` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `mot_de_passe_hash` VARCHAR(255) NOT NULL,
    `telephone` VARCHAR(20) NULL,
    `role` ENUM('client', 'administrateur', 'gestionnaire', 'formateur') NOT NULL DEFAULT 'client',
    `est_actif` BOOLEAN NOT NULL DEFAULT true,
    `langue_preferee` VARCHAR(5) NOT NULL DEFAULT 'fr',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `utilisateurs_email_key`(`email`),
    INDEX `utilisateurs_email_idx`(`email`),
    INDEX `utilisateurs_role_idx`(`role`),
    INDEX `utilisateurs_est_actif_idx`(`est_actif`),
    INDEX `utilisateurs_deleted_at_idx`(`deleted_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `est_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `categories_nom_idx`(`nom`),
    INDEX `categories_est_active_idx`(`est_active`),
    INDEX `categories_deleted_at_idx`(`deleted_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `produits` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `categorie_id` INTEGER NOT NULL,
    `nom` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `prix` DECIMAL(10, 2) NOT NULL,
    `image_url` VARCHAR(500) NULL,
    `est_disponible` BOOLEAN NOT NULL DEFAULT true,
    `est_actif` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `produits_categorie_id_idx`(`categorie_id`),
    INDEX `produits_nom_idx`(`nom`),
    INDEX `produits_est_disponible_idx`(`est_disponible`),
    INDEX `produits_est_actif_idx`(`est_actif`),
    INDEX `produits_deleted_at_idx`(`deleted_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `commandes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `client_id` INTEGER NOT NULL,
    `numero_commande` VARCHAR(50) NOT NULL,
    `type_commande` ENUM('retrait', 'livraison') NOT NULL DEFAULT 'retrait',
    `statut` ENUM('en_attente', 'confirmee', 'en_preparation', 'prete', 'terminee', 'annulee') NOT NULL DEFAULT 'en_attente',
    `statut_paiement` ENUM('non_paye', 'en_attente', 'paye', 'annule') NOT NULL DEFAULT 'non_paye',
    `montant_total` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `planifiee_pour` DATETIME(3) NULL,
    `notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `annulee_at` DATETIME(3) NULL,

    UNIQUE INDEX `commandes_numero_commande_key`(`numero_commande`),
    INDEX `commandes_client_id_idx`(`client_id`),
    INDEX `commandes_numero_commande_idx`(`numero_commande`),
    INDEX `commandes_statut_idx`(`statut`),
    INDEX `commandes_statut_paiement_idx`(`statut_paiement`),
    INDEX `commandes_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lignes_commande` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `commande_id` INTEGER NOT NULL,
    `produit_id` INTEGER NOT NULL,
    `quantite` INTEGER NOT NULL,
    `prix_unitaire` DECIMAL(10, 2) NOT NULL,
    `sous_total` DECIMAL(12, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `lignes_commande_commande_id_idx`(`commande_id`),
    INDEX `lignes_commande_produit_id_idx`(`produit_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `historiques_statut_commande` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `commande_id` INTEGER NOT NULL,
    `ancien_statut` ENUM('en_attente', 'confirmee', 'en_preparation', 'prete', 'terminee', 'annulee') NOT NULL,
    `nouveau_statut` ENUM('en_attente', 'confirmee', 'en_preparation', 'prete', 'terminee', 'annulee') NOT NULL,
    `change_par` INTEGER NOT NULL,
    `note` TEXT NULL,
    `changed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `historiques_statut_commande_commande_id_idx`(`commande_id`),
    INDEX `historiques_statut_commande_changed_at_idx`(`changed_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ateliers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titre` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `date_atelier` DATE NOT NULL,
    `heure_debut` VARCHAR(5) NOT NULL,
    `heure_fin` VARCHAR(5) NOT NULL,
    `capacite` INTEGER NOT NULL,
    `places_reservees` INTEGER NOT NULL DEFAULT 0,
    `prix` DECIMAL(10, 2) NOT NULL,
    `statut` ENUM('planifie', 'complet', 'termine', 'annule') NOT NULL DEFAULT 'planifie',
    `cree_par` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `ateliers_date_atelier_idx`(`date_atelier`),
    INDEX `ateliers_statut_idx`(`statut`),
    INDEX `ateliers_cree_par_idx`(`cree_par`),
    INDEX `ateliers_deleted_at_idx`(`deleted_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reservations_atelier` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `atelier_id` INTEGER NOT NULL,
    `client_id` INTEGER NOT NULL,
    `nombre_places` INTEGER NOT NULL,
    `montant_total` DECIMAL(10, 2) NOT NULL,
    `statut` ENUM('en_attente', 'confirmee', 'annulee') NOT NULL DEFAULT 'en_attente',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `annulee_at` DATETIME(3) NULL,

    INDEX `reservations_atelier_atelier_id_idx`(`atelier_id`),
    INDEX `reservations_atelier_client_id_idx`(`client_id`),
    INDEX `reservations_atelier_statut_idx`(`statut`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `articles_stock` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(255) NOT NULL,
    `unite` VARCHAR(50) NOT NULL,
    `quantite` DECIMAL(12, 3) NOT NULL DEFAULT 0,
    `seuil_minimal` DECIMAL(12, 3) NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    INDEX `articles_stock_nom_idx`(`nom`),
    INDEX `articles_stock_deleted_at_idx`(`deleted_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mouvements_stock` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `article_stock_id` INTEGER NOT NULL,
    `type_mouvement` ENUM('entree', 'sortie', 'ajustement') NOT NULL,
    `quantite` DECIMAL(12, 3) NOT NULL,
    `raison` TEXT NULL,
    `cree_par` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `mouvements_stock_article_stock_id_idx`(`article_stock_id`),
    INDEX `mouvements_stock_type_mouvement_idx`(`type_mouvement`),
    INDEX `mouvements_stock_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `journaux_audit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `utilisateur_id` INTEGER NULL,
    `action` VARCHAR(255) NOT NULL,
    `type_entite` VARCHAR(100) NOT NULL,
    `entite_id` VARCHAR(50) NULL,
    `metadonnees` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `journaux_audit_utilisateur_id_idx`(`utilisateur_id`),
    INDEX `journaux_audit_type_entite_idx`(`type_entite`),
    INDEX `journaux_audit_action_idx`(`action`),
    INDEX `journaux_audit_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jetons_rafraichissement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `utilisateur_id` INTEGER NOT NULL,
    `jeton_hash` VARCHAR(255) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `revoked_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `jetons_rafraichissement_utilisateur_id_idx`(`utilisateur_id`),
    INDEX `jetons_rafraichissement_jeton_hash_idx`(`jeton_hash`),
    INDEX `jetons_rafraichissement_expires_at_idx`(`expires_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `produits` ADD CONSTRAINT `produits_categorie_id_fkey` FOREIGN KEY (`categorie_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `commandes` ADD CONSTRAINT `commandes_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `utilisateurs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lignes_commande` ADD CONSTRAINT `lignes_commande_commande_id_fkey` FOREIGN KEY (`commande_id`) REFERENCES `commandes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lignes_commande` ADD CONSTRAINT `lignes_commande_produit_id_fkey` FOREIGN KEY (`produit_id`) REFERENCES `produits`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historiques_statut_commande` ADD CONSTRAINT `historiques_statut_commande_commande_id_fkey` FOREIGN KEY (`commande_id`) REFERENCES `commandes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historiques_statut_commande` ADD CONSTRAINT `historiques_statut_commande_change_par_fkey` FOREIGN KEY (`change_par`) REFERENCES `utilisateurs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ateliers` ADD CONSTRAINT `ateliers_cree_par_fkey` FOREIGN KEY (`cree_par`) REFERENCES `utilisateurs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reservations_atelier` ADD CONSTRAINT `reservations_atelier_atelier_id_fkey` FOREIGN KEY (`atelier_id`) REFERENCES `ateliers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reservations_atelier` ADD CONSTRAINT `reservations_atelier_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `utilisateurs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mouvements_stock` ADD CONSTRAINT `mouvements_stock_article_stock_id_fkey` FOREIGN KEY (`article_stock_id`) REFERENCES `articles_stock`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mouvements_stock` ADD CONSTRAINT `mouvements_stock_cree_par_fkey` FOREIGN KEY (`cree_par`) REFERENCES `utilisateurs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `journaux_audit` ADD CONSTRAINT `journaux_audit_utilisateur_id_fkey` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jetons_rafraichissement` ADD CONSTRAINT `jetons_rafraichissement_utilisateur_id_fkey` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
