import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export const DRIVE_PHOTOS = {
  'hero-living.png': { id: '19ZE0PAK9jXRpQsBtjk2xUPdmR63dU8Lm', source: 'CLEAN_Roll_04_Living_Entry.png' },
  'regular-team.png': { id: '1lbuDXQhZYS0GUmkIXfq3TaePNoJhOuk1', source: 'Action_06_LivingRoomTeamReset.png' },
  'deep-bathroom.png': { id: '1_r5ImmW6yjj5fWOxIF-2Wf9uG5-cphxG', source: 'CLEAN_Roll_02_Bathroom.png' },
  'move-ready.png': { id: '1YfJj0eQcUasMoFEXQL_yOuBJzs8wLNAo', source: 'Move_01_EmptyLivingRoom_MoveOutReady.png' },
  'office.png': { id: '1RgzYfITPbBkoK-Vkduto9ZA3Wksx98a6', source: 'Sunlit spotless home office.png' },
  'pet-corgi.png': { id: '1jtotPMuoiR8HCE5BC2dCPgK8Hn_Uyb2W', source: 'Pet_06_Corgi_CleanFeedingStation_Portland.png' },
  'kitchen.png': { id: '1gk74922SGt7azpRiEZpVbkMLGOfYL_vo', source: 'CLEAN_Roll_01_Kitchen.png' },
  'entry.png': { id: '1gWI0VX9T4deCt1mO2CQm9V0OUCwfyepi', source: 'Move_09_CleanEntry_Miami.png' },
  'detail.png': { id: '1XnaFVKkTXB2pG8OjmUcvY2RQCi-GJMA8', source: 'Corner_02_Bathroom_Baseboard_AFTER.png' },
  'pet-sofa.png': { id: '1A0b2yRasFbntbaYKZM_fl14UZLn-uxNi', source: 'Pet_07_Terrier_HairFreeSofa_Savannah.png' },
  'bathroom.png': { id: '1r7AcdXLbmKw4Z7sGra401HCKirx3GKJ1', source: 'MH50_C_Bathroom_02_Guest.png' },
  'bedroom.png': { id: '1hx3j9caZ2zzlQQKwDiPIGqlfPu6tqGU7', source: 'CLEAN_Roll_03_Bedroom.png' },
  'final-warm-entry.png': { id: '1dWvY9hqRaqhI4T0hTcJsEYsplvY2TwNQ', source: 'Warm Editorial Entryway and Living Room.png' }
};
function isPng(bytes) {
  return bytes.length > 4000 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
}
async function getPhoto(id) {
  const urls = [
    'https://drive.google.com/uc?export=download&confirm=t&id=' + encodeURIComponent(id),
    'https://drive.usercontent.google.com/download?id=' + encodeURIComponent(id) + '&export=download&confirm=t'
  ];
  const problems = [];
  for (const url of urls) {
    try {
      const response = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(22000), headers: { 'User-Agent':'Mozilla/5.0' } });
      const bytes = Buffer.from(await response.arrayBuffer());
      if (response.ok && isPng(bytes)) return bytes;
      problems.push(response.status + ' ' + response.headers.get('content-type') + ' (' + bytes.length + ' bytes)');
    } catch (error) { problems.push(String(error).slice(0, 140)); }
  }
  throw new Error('Public Drive image unavailable ' + id + ': ' + problems.join('; '));
}
export async function fetchDrivePhotos(output) {
  const dir = join(output, 'assets', 'drive');
  await mkdir(dir, { recursive: true });
  for (const [filename, photo] of Object.entries(DRIVE_PHOTOS)) {
    const image = await getPhoto(photo.id);
    await writeFile(join(dir, filename), image);
    console.log('Downloaded Drive photo: ' + filename + ' (' + image.length + ' bytes)');
  }
}
