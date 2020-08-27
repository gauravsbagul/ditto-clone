Contributing code to Ditto Chat - Mobile
==================================

todo: write this section

## How to Contribute

todo: write this section

## Code Style

For JavaScript code, we follow the [JavaScript Standard Style](https://standardjs.com/) rules. The code should be linted with `yarn lint` before creating a merge request. It is recommended to use an [ESLint Integration](https://eslint.org/docs/user-guide/integrations) with your code editor and to enable auto fix. It can also be done manually with `yarn lint-fix`.

## Attribution

todo: write this section

## Sign off

(this section borrowed from Riot Web: https://github.com/matrix-org/matrix-js-sdk/blob/master/CONTRIBUTING.rst)

In order to have a concrete record that your contribution is intentional
and you agree to license it under the same terms as the project's license, we've
adopted the same lightweight approach that the Linux Kernel
(https://www.kernel.org/doc/Documentation/SubmittingPatches), Docker
(https://github.com/docker/docker/blob/master/CONTRIBUTING.md), and many other
projects use: the DCO (Developer Certificate of Origin:
http://developercertificate.org/). This is a simple declaration that you wrote
the contribution or otherwise have the right to contribute it to Ditto:

    Developer Certificate of Origin
    Version 1.1

    Copyright (C) 2004, 2006 The Linux Foundation and its contributors.
    660 York Street, Suite 102,
    San Francisco, CA 94110 USA

    Everyone is permitted to copy and distribute verbatim copies of this
    license document, but changing it is not allowed.

    Developer's Certificate of Origin 1.1

    By making a contribution to this project, I certify that:

    (a) The contribution was created in whole or in part by me and I
        have the right to submit it under the open source license
        indicated in the file; or

    (b) The contribution is based upon previous work that, to the best
        of my knowledge, is covered under an appropriate open source
        license and I have the right under that license to submit that
        work with modifications, whether created in whole or in part
        by me, under the same open source license (unless I am
        permitted to submit under a different license), as indicated
        in the file; or

    (c) The contribution was provided directly to me by some other
        person who certified (a), (b) or (c) and I have not modified
        it.

    (d) I understand and agree that this project and the contribution
        are public and that a record of the contribution (including all
        personal information I submit with it, including my sign-off) is
        maintained indefinitely and may be redistributed consistent with
        this project or the open source license(s) involved.

If you agree to this for your contribution, then all that's needed is to
include the line in your commit or pull request comment:

    Signed-off-by: Your Name <your@email.example.org>

We accept contributions under a legally identifiable name, such as your name on
government documentation or common-law names (names claimed by legitimate usage
or repute). Unfortunately, we cannot accept anonymous contributions at this
time.

Git allows you to add this signoff automatically when using the ``-s`` flag to
``git commit``, which uses the name and email set in your ``user.name`` and
``user.email`` git configs.

If you forgot to sign off your commits before making your pull request and are
on Git 2.17+ you can mass signoff using rebase:

    git rebase --signoff origin/develop