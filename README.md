# catwithcode.moe
This is a source code mirror of my website, where I post my daily discoveries and random thoughts. It may happen that I reset this repository from time to time because of bugs I want to fix, which means that the history of commits is not and will not be complete from point zero.

# How to Update:
The "DeployWebsite.sh"-Script should do everything that is needed to update any part of the Website. Just write a new Entry and after executing the Script everything should be linked relatively and statically correctly.

# REDIRECT - WHY AM I HOSTING THE PAGE TWO TIMES:
Search Engines don't want to index my new Website. The Problem seems to be that I am not conforming to their web standards. When I hosted my site on github pages it worked fine. Well... now I will force bots to index my page one way or the other by indexing my github pages mirror or the jacky redirect which should not be executable by bots. This way my page will be found one way or the other. It works by loading a script that inserts HTML that executes the redirect. Looks weird, which it is, but it works. That type of code cannot be executed by most, if not all, bots. But the data is still there before the redirect, which is what makes indexing possible in the first place. It also only executes if it is not localhosted because archiving is important.

This is the Indexing Version:

[https://catwithcode.github.io/](https://catwithcode.github.io/)

The Real Website:

[https://catwithcode.moe/](https://catwithcode.moe/)
