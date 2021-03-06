import R from 'ramda';
import searchIndex from '../searchIndex';
import authenticatedClient from '../auth/authenticatedClient';
import { getAuthor } from './utils/author';

const historyMaxCountConfig = 'history/max_count';

export async function getAllKeys(req, res) {
  const manifests = await searchIndex.manifests;
  const keys = manifests.map(R.prop('key_path'));
  res.json(keys);
}

export async function getAllManifests(req, res) {
  res.json(await searchIndex.manifests);
}

export async function getKey(req, res, { keysRepository }, { params }) {
  const keyPath = params[0];
  const revision = req.query.revision;
  try {
    const keyDetails = await keysRepository.getKeyDetails(keyPath, { revision });
    res.json(keyDetails);
  } catch (exp) {
    res.sendStatus(404);
  }
}

export async function getKeyManifest(req, res, { keysRepository }, { params }) {
  const keyPath = params[0];
  const revision = req.query.revision;
  try {
    const manifest = await keysRepository.getKeyManifest(keyPath, { revision });
    res.json(manifest);
  } catch (exp) {
    res.sendStatus(404);
  }
}

export async function getDependents(req, res, { keysRepository }, { params }) {
  const keyPath = params[0];
  const dependents = await searchIndex.dependents(keyPath);

  res.json(dependents);
}

export async function getKeyRevisionHistory(req, res, { keysRepository, tweekApiHostname }, { params }) {
  const keyPath = params[0];

  const tweekApiClient = await authenticatedClient({ baseURL: tweekApiHostname });
  const user = (req.user && req.user.email) || 'unknown';

  const response = await tweekApiClient.get(
    `/api/v1/keys/@tweek/editor/${historyMaxCountConfig}?tweek_editor_user=${user}`,
  );
  const maxCount = response.data;

  const revisionHistory = await keysRepository.getKeyRevisionHistory(keyPath, { maxCount });
  res.json(revisionHistory);
}

export const saveKey = async (
  req,
  res,
  { keysRepository, author = getAuthor(req) },
  { params },
) => {
  const keyPath = params[0];

  const keyRulesSource = req.body.keyDef.source;
  const manifest = { key_path: keyPath, ...req.body.manifest };
  await keysRepository.updateKey(keyPath, manifest, keyRulesSource, author);

  res.send('OK');
};

export const deleteKey = async (
  req,
  res,
  { keysRepository, author = getAuthor(req) },
  { params },
) => {
  const keyPath = params[0];
  await keysRepository.deleteKey(keyPath, author);
  res.send('OK');
};

export async function getRevision(req, res, { keysRepository }) {
  const commit = await keysRepository.getRevision();
  res.json(commit.sha());
}
