import {
  Rocket, ShieldCheck, Zap, Clock, Users, Heart, Star, TrendingUp, Gem,
  Truck, Wallet, Headphones, Palette, Camera, Code, Globe, Leaf, Flame,
  Coffee, UtensilsCrossed, Salad, ChefHat, Wine, Award, Sparkles, Package
} from 'lucide-react';

const KEYWORD_MAP = [
  [/speed|fast|quick|instant/i, Zap],
  [/secure|safety|trust|protect/i, ShieldCheck],
  [/time|schedule|hour|delivery time/i, Clock],
  [/team|staff|people|community/i, Users],
  [/love|care|passion|favorite/i, Heart],
  [/premium|quality|best|top/i, Star],
  [/growth|scale|business|analytics/i, TrendingUp],
  [/luxury|elegant|exclusive|fine/i, Gem],
  [/delivery|shipping|logistics/i, Truck],
  [/price|afford|budget|cost|value/i, Wallet],
  [/support|help|service|assist/i, Headphones],
  [/design|creative|art|style/i, Palette],
  [/photo|visual|gallery|shoot/i, Camera],
  [/tech|code|develop|software/i, Code],
  [/global|worldwide|online|web/i, Globe],
  [/fresh|organic|natural|green|healthy/i, Leaf],
  [/spice|hot|grill|bold/i, Flame],
  [/coffee|cafe|brew/i, Coffee],
  [/menu|dish|cuisine|food/i, UtensilsCrossed],
  [/salad|veg|diet/i, Salad],
  [/chef|kitchen|cook/i, ChefHat],
  [/wine|drink|bar|beverage/i, Wine],
  [/award|recognition|winner/i, Award],
  [/launch|start|new/i, Rocket],
  [/package|bundle|plan/i, Package]
];

export function pickIcon(text = '', fallback = Sparkles) {
  const match = KEYWORD_MAP.find(([regex]) => regex.test(text));
  return match ? match[1] : fallback;
}
