-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN "typeCourse" TEXT NOT NULL DEFAULT 'ville';
ALTER TABLE "Reservation" ADD COLUMN "zoneDepart" TEXT;
ALTER TABLE "Reservation" ADD COLUMN "zoneArrivee" TEXT;
ALTER TABLE "Reservation" ADD COLUMN "montantEstime" INTEGER;
ALTER TABLE "Reservation" ADD COLUMN "numeroVol" TEXT;
ALTER TABLE "Reservation" ADD COLUMN "terminal" TEXT;
ALTER TABLE "Reservation" ADD COLUMN "heureAtterrissage" TEXT;
ALTER TABLE "Reservation" ADD COLUMN "attenteApresVol" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Reservation" ADD COLUMN "siegeEnfant" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Reservation" ADD COLUMN "heuresDisposition" INTEGER;
ALTER TABLE "Reservation" ADD COLUMN "pourAutrui" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Reservation" ADD COLUMN "passagerNom" TEXT;
ALTER TABLE "Reservation" ADD COLUMN "passagerTelephone" TEXT;
