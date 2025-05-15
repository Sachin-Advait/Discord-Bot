import URL from "../models/urls_model.js";

export async function handleGetURL(req, res) {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({ shortId });

    console.log(shortId);
    console.log(entry);

    if (!entry) {
        return res.status(404).json({ message: 'Short URL not found or not authorized' });
    }

    return res.status(200).redirect(entry.redirectUrl);
}
