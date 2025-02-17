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
  emergencyServices
} from '@shared/schema';

async function migrateTable(tableName: string, data: any[]) {
  if (data.length === 0) {
    console.log(`No data to migrate for ${tableName}`);
    return;
  }

  console.log(`Migrating ${tableName} (${data.length} records)...`);
  try {
    const { error } = await supabase.from(tableName).upsert(
      data.map(record => ({
        ...record,
        created_at: record.createdAt,
        updated_at: record.updatedAt,
      }))
    );

    if (error) {
      console.error(`Error migrating ${tableName}:`, JSON.stringify(error, null, 2));
      throw error;
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

    // Migrate users
    const userData = await db.select().from(users);
    await migrateTable('users', userData);

    // Migrate feedbacks
    const feedbackData = await db.select().from(feedbacks);
    await migrateTable('feedbacks', feedbackData);

    // Migrate officials
    const officialsData = await db.select().from(officials);
    await migrateTable('officials', officialsData);

    // Migrate communities
    const communitiesData = await db.select().from(communities);
    await migrateTable('communities', communitiesData);

    // Migrate forums
    const forumsData = await db.select().from(forums);
    await migrateTable('forums', forumsData);

    // Migrate parliamentary sessions
    const parliamentarySessionsData = await db.select().from(parliamentarySessions);
    await migrateTable('parliamentary_sessions', parliamentarySessionsData);

    // Migrate development projects
    const developmentProjectsData = await db.select().from(developmentProjects);
    await migrateTable('development_projects', developmentProjectsData);

    // Migrate posts
    const postsData = await db.select().from(posts);
    await migrateTable('posts', postsData);

    // Migrate forum moderators
    const forumModeratorsData = await db.select().from(forumModerators);
    await migrateTable('forum_moderators', forumModeratorsData);

    // Migrate forum members
    const forumMembersData = await db.select().from(forumMembers);
    await migrateTable('forum_members', forumMembersData);

    // Migrate emergency services
    const emergencyServicesData = await db.select().from(emergencyServices);
    await migrateTable('emergency_services', emergencyServicesData);

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

migrate();