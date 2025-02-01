import { CompassClient } from "../classes/CompassClient";

export interface CompassFeedItemAttachment {
    /**
     * The ID of the attachment.
     */
    id: number | null;
    /**
     * The file name of the attachment.
     * @example "image.jpg"
     * @example "document.pdf"
     */
    name: string | null;
    /**
     * The full URL that leads to the attachment.
     */
    url: string | null;
    /**
     * The type of the attachment.
     */
    type: CompassFeedItemAttachmentType | null;
}

export enum CompassFeedItemAttachmentType {
    /**
     * The attachment is an image, which is displayed inline on the feed.
     */
    "Image" = 1,
    /**
     * The attachment is a document, which is displayed as a link on the feed
     * item.
     */
    "Document" = 2,
}

export interface CompassFeedItem {
    // TODO: Comment/Reaction related properties. My institute does not have
    // comments on feed items, making it impossible to model these objects.
    // comments: CompassFeedItemComment[]; reactions: CompassFeedItemReaction[];

    /**
     * The attachments that are associated with the feed item.
     */
    attachments: CompassFeedItemAttachment[];
    /**
     * Whether the user can react to the feed item.
     */
    canReact: boolean;
    /**
     * The time the feed item was created.
     */
    createdTime: Date | null;
    /**
     * The author of the feed item.
     */
    author: {
        /**
         * The Compass ID of the author.
         */
        id: number | null;
        /**
         * The name of the author.
         */
        name: string | null;
        /**
         * The URL that leads to the author's photo.
         */
        photoURL: string | null;
    };
    /**
     * The ID of the feed item.
     */
    id: number | null;
    /**
     * Whether the feed item is saved by the user.
     */
    isSaved: boolean;
    /**
     * Whether the feed item is viewed by the user.
     */
    isViewed: boolean;
    /**
     * The content of the feed item.
     */
    content: string | null;
    /**
     * The title of the feed item.
     */
    title: string | null;
}

interface CompassGetFeedItemsConfig {
    /**
     * The number of feed items to fetch.
     */
    count?: number;
    /**
     * Whether to only fetch saved feed items.
     */
    isSavedOnly?: boolean;
}

/**
 * Get all news feed items for the user. Note that as a default, it only fetches
 * 25 items at once in order to not put pressure on the server. You can increase
 * this number if you wish, through the `count` config property.
 * @param {CompassGetFeedItemsConfig} config The configuration for fetching feed
 * items.
 * @returns {Promise<CompassFeedItem[]>} An array of feed items.
 */
export default async function GetFeedItems(
    this: CompassClient,
    config?: CompassGetFeedItemsConfig
): Promise<CompassFeedItem[]> {
    const request = await this.request(
        "/Services/Feed.svc/GetFeedItems",
        "POST",
        {
            count: config?.count ?? 25,
            sortBy: 1,
            filterOptions: {
                isSavedOnly: config?.isSavedOnly ?? false,
                tags: [],
            },
        }
    );

    if (!request || !request?.d) {
        throw new Error("Failed to fetch feed items within the institute.");
    }

    const items = request.d;
    const transformed = items.map(
        (item: any) =>
            ({
                attachments: Array.isArray(item?.attachments)
                    ? item.attachments.map(
                          (a: any) =>
                              ({
                                  id: a?.attachmentId ?? null,
                                  name: a?.name ?? null,
                                  url: a?.path
                                      ? new URL(a.path, this.baseURL).toString()
                                      : null,
                                  type: a?.type
                                      ? a?.type === 1
                                          ? CompassFeedItemAttachmentType.Image
                                          : CompassFeedItemAttachmentType.Document
                                      : null,
                              }) as CompassFeedItemAttachment
                      )
                    : [],
                canReact: !!item?.canReact,
                createdTime: item?.createdTimestamp
                    ? new Date(item.createdTimestamp)
                    : null,
                author: {
                    id: item?.userIdCreator ?? null,
                    name: item?.createdUserName ?? null,
                    photoURL: item?.userPhotoPath
                        ? new URL(item.userPhotoPath, this.baseURL)
                        : null,
                },
                id: item?.feedItemId ?? null,
                isSaved: !!item?.isSaved,
                isViewed: !!item?.isViewed,
                content: item?.itemContent ?? null,
                title: item?.title ?? null,
            }) as CompassFeedItem
    );

    return transformed;
}
