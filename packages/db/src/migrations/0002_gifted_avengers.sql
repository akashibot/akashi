-- Step 1: Add a new column with the desired name and integer type
ALTER TABLE "tags" ADD COLUMN "uses_temp" integer DEFAULT 0;

-- Step 2: Update the new column with the converted values
UPDATE "tags" SET "uses_temp" = CASE 
    WHEN "nsfw" = true THEN 1 
    WHEN "nsfw" = false THEN 0 
    ELSE 0 
END;

-- Step 3: Drop the old column
ALTER TABLE "tags" DROP COLUMN "nsfw";

-- Step 4: Rename the new column to the desired name
ALTER TABLE "tags" RENAME COLUMN "uses_temp" TO "uses";

-- Step 5: Set the default value for the new column
ALTER TABLE "tags" ALTER COLUMN "uses" SET DEFAULT 0;
