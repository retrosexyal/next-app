import GroupStudent from "@/models/group-student-model";
import Subscription from "@/models/subscription-model";

export async function getActiveSubscription(studentId: string) {
  const student = await GroupStudent.findById(studentId).select(
    "activeSubscription",
  );
  if (!student?.activeSubscription) {
    return { student, subscription: null };
  }

  const subscription = await Subscription.findById(
    student.activeSubscription,
  );

  // Самовосстановление после старых или вручную удалённых записей.
  if (!subscription) {
    student.activeSubscription = null;
    await student.save();
    return { student, subscription: null };
  }

  if (
    Number(subscription.usedLessons || 0) >=
    Number(subscription.totalLessons || 0)
  ) {
    await retireSubscriptionIfExhausted(subscription);
    return { student, subscription: null };
  }

  return { student, subscription };
}

export async function retireSubscriptionIfExhausted(subscription: any) {
  const remaining = Math.max(
    0,
    Number(subscription.totalLessons || 0) -
      Number(subscription.usedLessons || 0),
  );

  if (remaining > 0) return false;

  await GroupStudent.updateOne(
    {
      _id: subscription.student,
      activeSubscription: subscription._id,
    },
    { $set: { activeSubscription: null } },
  );

  return true;
}
