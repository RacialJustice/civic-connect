import { db } from '../server/db';
import { supabase } from './config';
import {
  users,
  feedbacks,
  officials,
  communities,
  forums,
  parliamentarySessions,
  developmentProjects,
  posts,
  forumModerators,
  forumMembers,
  emergencyServices,
  type SelectUser,
  type SelectFeedback,
  type SelectOfficial,
  type SelectCommunity,
  type SelectForum,
  type SelectParliamentarySession,
  type SelectDevelopmentProject,
  type SelectPost,
  type SelectForumModerator,
  type SelectForumMember,
  type SelectEmergencyService
} from '@shared/schema';

async function migrateTable<T extends Record<string, any>>(tableName: string, data: T[]) {
  if (data.length === 0) {
    console.log(`No data to migrate for ${tableName}`);
    return;
  }

  console.log(`Migrating ${tableName} (${data.length} records)...`);
  try {
    // Process data in batches of 100 to avoid timeouts
    const batchSize = 100;
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      const { error } = await supabase.from(tableName).upsert(
        batch.map(record => ({
          ...record,
          created_at: record.createdAt,
          updated_at: record.updatedAt,
        }))
      );

      if (error) {
        console.error(`Error migrating ${tableName} batch ${i / batchSize + 1}:`, JSON.stringify(error, null, 2));
        throw error;
      }
      console.log(`Successfully migrated batch ${i / batchSize + 1} of ${Math.ceil(data.length / batchSize)} for ${tableName}`);
    }
    console.log(`Successfully migrated ${data.length} records to ${tableName}`);
  } catch (error) {
    console.error(`Failed to migrate ${tableName}:`, error);
    throw error;
  }
}

async function migrate() {
  try {
    // First verify database connections
    console.log('Verifying PostgreSQL connection...');
    const testQuery = await db.select().from(users).limit(1);
    console.log('PostgreSQL connection successful');

    console.log('Verifying Supabase connection...');
    const { data: testData, error: testError } = await supabase.from('users').select('*').limit(1);
    if (testError) throw new Error(`Supabase connection test failed: ${testError.message}`);
    console.log('Supabase connection successful');

    // Start migration
    console.log('Starting migration...');

    // Migrate data in order of dependencies
    // First, migrate independent tables
    const userData = await db.select().from(users);
    await migrateTable<SelectUser>('users', userData);

    const officialsData = await db.select().from(officials);
    await migrateTable<SelectOfficial>('officials', officialsData);

    const communitiesData = await db.select().from(communities);
    await migrateTable<SelectCommunity>('communities', communitiesData);

    const forumsData = await db.select().from(forums);
    await migrateTable<SelectForum>('forums', forumsData);

    const parliamentarySessionsData = await db.select().from(parliamentarySessions);
    await migrateTable<SelectParliamentarySession>('parliamentary_sessions', parliamentarySessionsData);

    // Then migrate dependent tables
    const developmentProjectsData = await db.select().from(developmentProjects);
    await migrateTable<SelectDevelopmentProject>('development_projects', developmentProjectsData);

    const postsData = await db.select().from(posts);
    await migrateTable<SelectPost>('posts', postsData);

    const forumModeratorsData = await db.select().from(forumModerators);
    await migrateTable<SelectForumModerator>('forum_moderators', forumModeratorsData);

    const forumMembersData = await db.select().from(forumMembers);
    await migrateTable<SelectForumMember>('forum_members', forumMembersData);

    const emergencyServicesData = await db.select().from(emergencyServices);
    await migrateTable<SelectEmergencyService>('emergency_services', emergencyServicesData);

    const feedbackData = await db.select().from(feedbacks);
    await migrateTable<SelectFeedback>('feedbacks', feedbackData);

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

migrate();