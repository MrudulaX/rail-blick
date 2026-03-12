import xgbWeights from '../../public/data/xgb_weights.json';

function traverseTree(node, features) {
    if (node.leaf_value !== undefined) {
        return node.leaf_value;
    }

    const featureValue = features[node.split_feature] ?? 0;

    if (featureValue <= node.split_threshold) {
        return traverseTree(node.left, features);
    } else {
        return traverseTree(node.right, features);
    }
}

export function predictConfirmationProbability(input) {
    const features = [
        input.wl_position,
        input.days_before_travel,
        input.route_demand_score,
        input.season_index,
        input.class_type_encoded,
        input.train_type_encoded,
        input.day_of_week_encoded
    ];

    let rawScore = xgbWeights.base_score;

    for (let i = 0; i < xgbWeights.trees.length; i++) {
        const tree = xgbWeights.trees[i];
        rawScore += traverseTree(tree, features);
    }

    const prob = 1 / (1 + Math.exp(-rawScore));

    return Math.max(0, Math.min(1, prob));
}