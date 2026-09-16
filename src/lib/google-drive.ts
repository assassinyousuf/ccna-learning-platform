import { google } from "googleapis";

function getDriveClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!email || !privateKey) {
    return null;
  }

  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/drive"],
  });

  return google.drive({ version: "v3", auth });
}

export interface ResumableSessionOptions {
  fileName: string;
  mimeType: string;
  fileSize: number;
}

export async function createResumableUploadSession(options: ResumableSessionOptions): Promise<{ uploadUrl: string; fileId?: string }> {
  const drive = getDriveClient();
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (!drive) {
    // Return mock upload endpoint for local development
    return {
      uploadUrl: `/api/drive/mock-upload?fileName=${encodeURIComponent(options.fileName)}`,
    };
  }

  try {
    const fileMetadata: { name: string; parents?: string[] } = {
      name: `[CCNA Sub] ${options.fileName}`,
    };

    if (folderId) {
      fileMetadata.parents = [folderId];
    }

    // Request resumable upload session from Google Drive
    const response = await drive.files.create(
      {
        requestBody: fileMetadata,
        media: {
          mimeType: options.mimeType,
        },
        fields: "id",
      },
      {
        // Tell Google API client to initialize resumable upload session
        url: "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable",
        method: "POST",
      }
    );

    // The Location header in the response contains the direct resumable upload URL
    const uploadUrl = (response.headers as Record<string, string>)["location"];
    return { uploadUrl, fileId: response.data.id || undefined };
  } catch (error) {
    console.error("Error creating Google Drive upload session:", error);
    return {
      uploadUrl: `/api/drive/mock-upload?fileName=${encodeURIComponent(options.fileName)}`,
    };
  }
}

export async function makeFilePublic(fileId: string): Promise<string> {
  const drive = getDriveClient();
  if (!drive) {
    return `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
  }

  try {
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    const file = await drive.files.get({
      fileId,
      fields: "webViewLink",
    });

    return file.data.webViewLink || `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
  } catch (error) {
    console.error("Error setting Drive file permissions:", error);
    return `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
  }
}
