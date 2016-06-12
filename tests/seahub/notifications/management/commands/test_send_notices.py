from django.core import mail
from django.core.management import call_command
from post_office.models import Email

from seahub.notifications.models import UserNotification, repo_share_msg_to_json
from seahub.profile.models import Profile
from seahub.test_utils import BaseTestCase


class CommandTest(BaseTestCase):

    def test_can_send(self):
        self.assertEqual(len(mail.outbox), 0)
        assert len(Email.objects.all()) == 0

        UserNotification.objects.add_repo_share_msg(
            self.user.username, repo_share_msg_to_json('bar@bar.com', self.repo.id))
        call_command('send_notices')

        self.assertEqual(len(mail.outbox), 1)
        assert mail.outbox[0].to[0] == self.user.username
        assert len(Email.objects.all()) == 1
        assert 'New notice on' in Email.objects.all()[0].subject
        assert 'has shared a library named' in Email.objects.all()[0].html_message

    def test_can_send_to_contact_email(self):
        self.assertEqual(len(mail.outbox), 0)
        UserNotification.objects.add_repo_share_msg(
            self.user.username, repo_share_msg_to_json('bar@bar.com', self.repo.id))
        p = Profile.objects.add_or_update(self.user.username, 'nickname')
        p.contact_email = 'contact@foo.com'
        p.save()

        call_command('send_notices')
        self.assertEqual(len(mail.outbox), 1)
        assert mail.outbox[0].to[0] == 'contact@foo.com'
