import faunadb from 'faunadb';
//
const { query: q } = faunadb;

const { FAUNADB_SECRET: secret } = process.env;

let client;

if (secret) {
    client = new faunadb.Client({ secret });
}

export default async (req, res) => {
	console.log('secret', secret);
    try {
        let collections = [];

        if (!client) {
            return [];
        }

        await client
            .paginate(q.Collections())
            .map(ref => q.Get(ref))
            .each(page => {
                collections = collections.concat(page);
            });

        res.json({ collections });
    } catch (error) {
        res.status(500).json({ error });
    }
};
