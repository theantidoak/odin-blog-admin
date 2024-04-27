import { error } from "@sveltejs/kit";
import dotenv from 'dotenv';
import { json } from "@sveltejs/kit";
dotenv.config();

export async function DELETE(event: any) {
  const deleteResponse = await fetch(`${process.env.APIENDPOINT}/api/comments/${event.params.id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'APIToken': `Token ${process.env.APITOKEN}`
    }
  });

  if (!deleteResponse.ok) {
    error(deleteResponse.status, `${deleteResponse.statusText}. Failed to reach the API.`);
  }

  const deleteJson = await deleteResponse.json();
  const { success, message } = deleteJson;

  return json({ success, status: 201 });
}
