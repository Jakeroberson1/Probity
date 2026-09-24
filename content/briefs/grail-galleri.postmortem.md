# Post-mortem: GRAIL Galleri panel vote

*Call published Sep 21, 2026. Graded Sep 23, 2026. Method v1.0.*

**The call:** YES at 65% on Voting Question 3 (benefits outweigh risks).
**The outcome:** The panel voted 7-2 in favor, with one abstention. Q1 (safety) went 10-0 yes and Q2 (effectiveness) went 6-4 yes.
**The grade:** Correct. Track record: 1-0. Brier score: 0.1225.

## What we got right

We had the direction right. We published a yes on benefit-risk two days before the vote, and the post is timestamped and hasn't been edited since.

We also picked the right fight. Our preview said the argument would be over whether "early detection" stays on the label, and the panel spent much of its discussion on exactly that: whether to strike "early" from "multi-cancer early detection." Our middle scenario was a yes on benefit-risk with the panel pushing back on the "early" claim, which is what happened.

Safety was never the sticking point. FDA had no outstanding safety questions, and Q1 was the cleanest vote of the day at 10-0. That matches what the gates showed.

## What we got wrong, or where the crowd did better

The crowd beat us. Consensus was at 72.5% and we were at 65%, so we were on the same side with a worse number. Their Brier score was 0.0756 to our 0.1225. Sitting below consensus felt like discipline at the time, but on this call it just cost us accuracy, and that belongs on the record.

The margins were also thinner than "yes on all three" makes it sound. A 6-4 vote on effectiveness and a 7-2 vote with an abstention on benefit-risk add up to a contested yes. Our framing of a narrow yes without much confidence holds up. Still, effectiveness was two votes away from going the other way.

We didn't model abstentions. One member abstained on the deciding question, which is a normal part of how these panels vote, and the method has nothing that accounts for it. It's in the method log, but we aren't changing anything based on one case.

## Calibration

One graded call says nothing about calibration. A 65% call that lands is one data point, and a Brier score from a single event is where we start from. It doesn't prove anything yet. What the track record is supposed to show over time is whether our 70% calls come true about 70% of the time, and answering that takes dozens of calls. Until we have them, every score gets published, including the ones where the crowd does better than we do.

## Does the method change?

No, Method v1.0 stays as it is. We'd revise the seven gates in response to patterns across many calls, not a single outcome. The panel's vote is also only a recommendation. FDA's decision is expected in Q1 next year (per MarketWatch), and the question of whether "early" stays on the label, which we flagged as the crux, is still open.
